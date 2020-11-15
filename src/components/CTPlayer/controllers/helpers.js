import timestr from 'utils/use-time';
import downloadFile from 'js-file-download';
import { api, uurl, prompt, _copyTextToClipboard, _readFileAsBinary } from 'utils';

/**
 * Function used to get the size for the player
 * @returns {{width:string, height:string}} the player's size object
 */
export function _getPlayerSize({ width, height, fill, isFullscreen }) {
  if (fill || isFullscreen) {
    return { width: '100%', height: '100%' };
  }

  return {
    minHeight: `${width * 0.5}px`,
    width: `${width || 560 }px`,
    height: height ? (`${height }px`) : 'max-content'
  };
}

/**
 * Determine if the time block is current or not
 * @param {{begin:string, end:string}} block - time blocks `{ begin, end }`
 * @param {Number} now - current time in seconds
 * @returns {Boolean} True if the time block is current
 */
export function _isCurrentTimeBlock(block, now) {
  if (!block || !block.begin || !block.end) return false;

  let end = typeof block.end === 'number' 
          ? block.end 
          : timestr.toSeconds(block.end);
  let begin = typeof block.begin === 'number' 
          ? block.begin 
          : timestr.toSeconds(block.begin);

  return begin <= now && now <= end;
}

/**
 * Find the current time block using binary search 
 * @todo NOT WORKING !!
 * @param {{begin:string, end:string}[]} blocks - array of time blocks `{ begin, end }`
 * @param {Number} now - current time in seconds
 * @param {Number} startIndex - the lower bound of the blocks
 * @returns {{begin:string, end:string}} Current block or null if not found
 */
export function _findCurrTimeBlock(blocks, now, startIndex = 0, endIndex) {
  let lo = startIndex;
  let hi = endIndex || blocks.length;
  while (lo < hi) {
    let mid = Math.floor((hi + lo) / 2);
    let end = timestr.toSeconds(blocks[mid].end);
    let begin = timestr.toSeconds(blocks[mid].begin);
    // console.log(now, `(${begin}, ${end})`, `(${lo}, ${hi})`);
    if (begin <= now && now <= end) {
      // console.log('done', blocks[mid].text);
      return blocks[mid];
    }

    if (now > end) {
      lo = mid + 1;
    } else { // now < begin
      hi = mid - 1;
    }
  }

  // console.log('failed');
  return null;
}

/**
 * 
 * @param {HTMLVideoElement} videoNode - video element
 * @param {Function} callback - will pass in the screenshot blob's url
 * @see https://stackoverflow.com/questions/23745988/get-an-image-from-the-video/44325898
 */
export function _captureVideoImage(videoNode, callback) {
  const canvas = document.createElement("canvas");
  // scale the canvas accordingly
  canvas.width = videoNode.videoWidth;
  canvas.height = videoNode.videoHeight;
  // draw the video at that frame
  canvas.getContext('2d')
    .drawImage(videoNode, 0, 0, canvas.width, canvas.height);
  // convert it to a usable data URL
  canvas.toBlob((blob) => {
    if (typeof callback === 'function') {
      callback(URL.createObjectURL(blob), blob)
    } else {
      window.open(URL.createObjectURL(blob), blob);
    }
  }, 'image/jpeg');
}

export function _downloadScreenshotByBlob(imgBlob, time, mediaName) {
  downloadFile(imgBlob, `(${timestr.toTimeString(time)}) - ${mediaName}.jpg`);
}

export function _encodeScreenshotPath(imgData) {
  return uurl.getMediaUrl(imgData.imageFile.path) 
       + uurl.createHash({ ctimgid: imgData.id });
}

export async function _decodeScreenshotPath(path) {
  const { ctimgid } = uurl.useHash(path);
  if (!ctimgid) return null;
  return {
    url: uurl.purePath(path),
    id: ctimgid
  };
}

export async function _createImage(imgBlob, sourceType, sourceId) {
  try {
    const imageFile = new File([imgBlob], 'screenshot.jpg', { type: 'image/jpg' });
    const { data } = await api.createImage(imageFile, sourceType, sourceId);
    return data;
  } catch (error) {
    console.error(error);
    prompt.error('Failed to create the image.');
    return null;
  }
}

export async function _copyScreenshotLink(imgBlob, sourceType, sourceId) {
  const imgData = await _createImage(imgBlob, sourceType, sourceId);
  if (!imgData) {
    return;
  }

  const successed = await _copyTextToClipboard(_encodeScreenshotPath(imgData));
  return successed;
}