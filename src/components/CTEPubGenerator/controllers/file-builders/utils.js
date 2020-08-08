import _ from 'lodash';
import axios from 'axios';
import { uurl } from 'utils';
import EPubData from '../EPubData';
import { buildHTMLFromChapter } from '../html-converters';
import { EPubValidationError, LoadImageError } from './errors';

export function parseChapters(chapters, replaceSrc = true) {
  return _.map(chapters, (chapter, chIdx) => {
    const chapterId = `chapter-${chIdx + 1}`;
    // Change all the subchapters' id
    const subChapters = _.map(chapter.subChapters, (subChapter, schIdx) => ({
      ...subChapter,
      id: `${chapterId}-sch-${schIdx + 1}`
    }));
    
    // Remove invalid syntax for xhtml
    let html = buildHTMLFromChapter({ ...chapter, id: chapterId, subChapters })
      .replace(/&nbsp;/g, '&#160;')
      .replace(/<br>/g, '<br/>');

    const doc = new DOMParser().parseFromString(html, 'text/html');

    // get all images from html
    const imgEls = doc.getElementsByTagName('img');
    const images = _.map(imgEls, (imgEl, imgIdx) => {
      const imgID = `${chapterId}-img-${imgIdx + 1}`;
      const src = uurl.getMediaUrl(imgEl.src);
      const relSrc = `images/${imgID}.jpeg`; // relative src path for an image
      if (replaceSrc) {
        imgEl.src = relSrc;
      }

      return { src, relSrc, id: imgID };
    });

    // Serialize xhtml
    const xhtml = new XMLSerializer().serializeToString(doc);

    // Only keep codes inside the <body>..</body>
    const bodyText = xhtml
      .replace('<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>', '')
      .replace('</body></html>', '');

    return {
      id: chapterId,
      title: chapter.title,
      text: bodyText,
      images,
      subChapters,
    };
  });
}

export function parseEPubData(epubData, replaceSrc = true) {
  if (!(epubData instanceof EPubData)) {
    throw EPubValidationError;
  }

  const data = epubData.toObject();
  data.cover = uurl.getMediaUrl(data.cover);
  data.chapters = parseChapters(data.chapters, replaceSrc);

  return data;
}

export async function loadImageBuffer(src) {
  try {
    const { data } = await axios.get(uurl.getMediaUrl(src), { responseType: 'arraybuffer' });
    return Buffer.from(data);
  } catch (error) {
    throw LoadImageError;
  }
}

export async function loadEPubImageBuffers({ cover, chapters }) {
  const coverBuffer = await loadImageBuffer(cover);

  const images = [];
  for (let i = 0; i < chapters.length; i += 1) {
    const ch = chapters[i];
    if (ch.images) {
      /* eslint-disable no-await-in-loop */
      for (let j = 0; j < ch.images.length; j += 1) {
        const img = ch.images[j];
        const buffer = await loadImageBuffer(img.src);
        images.push({ ...img, buffer });
      }
      /* eslint-enable no-await-in-loop */
    }
  }

  return {
    coverBuffer,
    images,
  };
}
