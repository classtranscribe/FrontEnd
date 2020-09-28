import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../ActionButton';
import ScreenshotPopup from './ScreenshotPopup';

function Screenshot(props) {
  const { mediaName, captureScreenshot } = props;
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshotCaptured = (url, blob) => {
    // alert(url)
    setScreenshot({ url, blob });
  };

  const handleCaptureScreenshot = () => {
    captureScreenshot(handleScreenshotCaptured);
  };

  const handleClosePopup = () => setScreenshot(null);

  const popupOpened = Boolean(screenshot)
  
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
        mediaName={mediaName}
        imgBlob={screenshot}
        onClose={handleClosePopup}
      />
    </div>
  );
}

Screenshot.propTypes = {
  onClick: PropTypes.func
};

export default Screenshot;