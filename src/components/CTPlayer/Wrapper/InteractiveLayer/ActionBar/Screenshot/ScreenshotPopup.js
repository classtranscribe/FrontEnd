import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Button } from 'pico-ui';

function ScreenshotPopup(props) {
  let {
    open,
    imgBlobUrl,
    onClose,
  } = props;

  const [copyStatus, setCopyStatus] = useState(0);

  const handleCopy = () => {
    
  };

  const copied = copyStatus > 0;

  return open ? (
    <ClickAwayListener
      onClickAway={onClose}
    >
      <div className="ctp share-popup screenshot">
        <h5>Captured Image</h5>
        <div className="ctp share-image">
          <img src={imgBlobUrl} alt="Captured screenshot" />
        </div>
        <div className="ctp ct-d-r-end">
          <Button
            compact
            icon={copied ? 'check' : null}
            color="white"
            onClick={handleCopy}
          >
            {copied ? 'COPIED' : 'COPY IMAGE LINK'}
          </Button>
          <Button
            compact
            color="black"
            onClick={onClose}
            classNames="ml-2"
          >
            CANCEL
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  ) : null;
}

ScreenshotPopup.propTypes = {
  open: PropTypes.bool,
  shareLink: PropTypes.string,
  onClose: PropTypes.func,
};

export default ScreenshotPopup;

