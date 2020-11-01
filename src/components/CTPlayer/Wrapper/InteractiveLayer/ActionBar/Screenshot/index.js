import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../ActionButton';
import ScreenshotPopup from './ScreenshotPopup';

function Screenshot(props) {
  const { player, actionElement } = props;
  const [screenshot, setScreenshot] = useState(null); // null | { url, blob }

  const handleScreenshotCaptured = (url, blob) => {
    // alert(url)
    setScreenshot({ url, blob });
  };

  const handleCaptureScreenshot = () => {
    // capture image of the primary video
    player.captureImage(!player.isSwappedScreen, handleScreenshotCaptured);
  };

  const handleDownloadScreenshot = () => {
    player.downloadScreenshot(screenshot.blob);
  };

  const handleCopyScreenshotLink = async () => {
    const successed = await player.copyScreenshotLink(screenshot.blob);
    return successed;
  };

  const handleClosePopup = () => setScreenshot(null);

  const popupOpened = Boolean(screenshot);
  const { height } = player.playerBoundingRect;
  
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