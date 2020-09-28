import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../ActionButton';
import ScreenshotPopup from './ScreenshotPopup';

function Screenshot(props) {
  const { captureScreenshot } = props;
  const [screenshot, setScreenshot] = useState(null);

  const handleScreenshotCaptured = (url) => {
    // alert(url)
    setScreenshot(url);
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
        // classNames="ctp screenshot-btn"
        disabled={popupOpened}
      />
      <ScreenshotPopup
        open={popupOpened}
        imgBlobUrl={screenshot}
        onClose={handleClosePopup}
      />
    </div>
  );
}

Screenshot.propTypes = {
  onClick: PropTypes.func
};

export default Screenshot;