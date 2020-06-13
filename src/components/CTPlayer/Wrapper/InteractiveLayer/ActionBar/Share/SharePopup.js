import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import { Button } from 'pico-ui';

function SharePopup(props) {
  let {
    open,
    shareLink,
    onClose,
  } = props;

  const shareLinkRef = useRef();
  const [copyStatus, setCopyStatus] = useState(0);

  const handleCopy = () => {
    shareLinkRef.current.select();
    document.execCommand('copy');
    setCopyStatus(1);
    setTimeout(() => setCopyStatus(0), 2000);
  };

  useEffect(() => {
    if (open) {
      shareLinkRef.current.select();
    }
  }, [open]);

  const copied = copyStatus > 0;

  return open ? (
    <ClickAwayListener
      onClickAway={onClose}
    >
      <div className="ctp share-popup">
        <h5>SHARE LINK</h5>
        <div className="ctp share-link">
          <input readOnly ref={shareLinkRef} value={shareLink} />
        </div>
        <div className="ctp ct-d-r-end">
          <Button
            compact
            icon={copied ? 'check' : null}
            color="teal"
            onClick={handleCopy}
          >
            {copied ? 'COPIED' : 'COPY LINK'}
          </Button>
        </div>
      </div>
    </ClickAwayListener>
  ) : null;
}

SharePopup.propTypes = {
  shareLink: PropTypes.string,
  onClose: PropTypes.func,
};

export default SharePopup;

