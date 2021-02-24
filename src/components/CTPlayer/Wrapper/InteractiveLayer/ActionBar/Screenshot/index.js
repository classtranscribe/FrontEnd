import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { prompt } from 'utils';
import SourceTypes from 'entities/SourceTypes';
import ActionButton from '../../ActionButton';
import ScreenshotPopup from './ScreenshotPopup';
import { 
  _captureVideoImage, 
  _copyScreenshotLink, 
  _downloadScreenshotByBlob 
} from '../../../../controllers/helpers'

function Screenshot(props) {
  const { media, actionElement } = props;
  const [screenshot, setScreenshot] = useState(null); // null | { url, blob }

  const handleScreenshotCaptured = (url, blob) => {
    // alert(url)
    setScreenshot({ url, blob });
  };

  const handleCaptureScreenshot = () => {
    // capture image of the primary video
    // this.pause();
    const video = document.getElementById('ct-video-1');
    if (video) {
      try {
        _captureVideoImage(video, (url, blob) => {
          handleScreenshotCaptured(url, blob)
          // this.__onScreenshotCaptured(url, blob);
        });
      } catch {
        prompt.error({ text: 'Failed to screenshot', timeout: 4000 });
      }
    }
  };

  const handleDownloadScreenshot = () => {
    _downloadScreenshotByBlob(screenshot.blob, "T", media.mediaName);
    // NOT IMPLEMENTED: TIME
  };

  const handleCopyScreenshotLink = async () => {
    const successed = await _copyScreenshotLink(
      screenshot.blob,
      SourceTypes.Media,
      media.id);

    return successed;
  };

  const handleClosePopup = () => setScreenshot(null);

  const popupOpened = Boolean(screenshot);
  const { height } = {}; // player.playerBoundingRect; getBoundingClientRect() not implemented

  return (
    <div className="ctp share-root">
      <ActionButton
        label="Take a screenshot"
        icon="camera_alt"
        onClick={handleCaptureScreenshot}
        labelPlacement="bottom"
        disabled={popupOpened}
      />
      <ScreenshotPopup
        open={popupOpened}
        height={height}
        imgBlob={screenshot}
        actionElement={actionElement}
        onClose={handleClosePopup}
        downloadScreenshot={handleDownloadScreenshot}
        copyScreenshotLink={handleCopyScreenshotLink}
      />
    </div>
  );
}

Screenshot.propTypes = {
  onClick: PropTypes.func
};

export default Screenshot;