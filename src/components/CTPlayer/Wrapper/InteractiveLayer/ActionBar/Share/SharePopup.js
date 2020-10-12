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

  const selectLinkInput = () => shareLinkRef.current.select();

  const handleCopy = () => {
    selectLinkInput();
    document.execCommand('copy');
    setCopyStatus(1);
    setTimeout(() => {
      setCopyStatus(0);
      onClose();
    }, 2000);
  };

  // useEffect(() => {
  //   if (open) {
  //     shareLinkRef.current.select();
  //   }
  // }, [open]);

  const copied = copyStatus > 0;

  return open ? (
    <ClickAwayListener
      onClickAway={onClose}
    >
      <div
        role="dialog"
        id="ctp-share-con"
        className="ctp share-popup"
        aria-modal="true"
        aria-labelledby="ctp-share-title"
      >
        <h5 id="ctp-share-title">SHARE LINK</h5>
        <div className="ctp share-link">
          <input
            readOnly
            ref={shareLinkRef}
            value={shareLink}
            onFocus={selectLinkInput}
          />
        </div>
        <div className="ctp ct-d-r-end">
          <Button
            compact
            icon={copied ? 'check' : null}
            color="white"
            onClick={handleCopy}
            autoFocus
          >
            {copied ? 'COPIED' : 'COPY LINK'}
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

SharePopup.propTypes = {
  open: PropTypes.bool,
  shareLink: PropTypes.string,
  onClose: PropTypes.func,
};

export default SharePopup;

