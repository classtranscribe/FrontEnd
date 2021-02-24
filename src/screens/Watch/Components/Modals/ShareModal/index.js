import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva'
import { isMobile } from 'react-device-detect';
import { timestr } from 'utils';
import { getShareableURL } from '../../../Utils';
import './index.css';

function ShareModal({ show = false, onClose, embed = false, setEmbed, currTime, dispatch }) {
  const inputRef = useRef();
  const [begin, setBegin] = useState(-1); // -1 X, >0 √
  const [copy, setCopy] = useState(0); // -1 unset, 0 copying, 1 copied

  const onCopy = () => {
    inputRef.current.select();
    document.execCommand('copy');
    setCopy(1);
    inputRef.current.blur();
    setTimeout(() => setCopy(-1), 2000);
  };

  const onRadioChange = () => {
    if (begin >= 0) {
      setBegin(-1);
    } else {
      setBegin(currTime);
    }
  };

  const openEmbedModal = () => {
    setEmbed(true)
    dispatch({ type: 'watch/media_pause' });
  };

  useEffect(() => {
    if (show) {
      setBegin(currTime);
    }
  }, [show]);

  useEffect(() => {
    if (embed) {
      onClose();
    }
  }, [embed]);

  const shareURL = getShareableURL(begin);

  return (
    <div id="watch-share-modal" className="wmodal-box-gen" data-position="right top">
      <div className="wml-header">
        <h3>
          <i className="material-icons" aria-hidden="true">
            share
          </i>
          Share Video
        </h3>
        <button className="plain-btn wml-close-btn" aria-label="Close" onClick={onClose}>
          <span tabIndex="-1">
            <i className="material-icons">close</i>
          </span>
        </button>
      </div>
      <div className="wml-content">
        <div className="w-100 d-flex align-items-center wml-share-url">
          <input
            ref={inputRef}
            className="plain-btn wml-share-url-input"
            value={shareURL}
            onChange={() => null}
          />
          <button
            className="plain-btn wml-share-url-cpy"
            aria-label="Copy"
            onClick={onCopy}
            data-copyed={Boolean(copy > 0).toString()}
            disabled={copy > 0}
          >
            <span tabIndex="-1">
              {copy > 0 ? (
                <>
                  <i className="material-icons">check</i>COPIED
                </>
              ) : (
                <>
                  <i className="material-icons">file_copy</i>COPY
                </>
                )}
            </span>
          </button>
        </div>

        <div className="w-100 wml-share-radio">
          <label className="ct-radio">
            <input
              id="wml-share-radio"
              type="checkbox"
              checked={begin >= 0}
              onChange={onRadioChange}
            />
            <span className="radio-slider round" /> radio
          </label>

          <label className="wml-share-radio-label" htmlFor="wml-share-radio">
            Share video with current time
          </label>

          <div className="wml-share-time" data-show={Boolean(begin >= 0).toString()}>
            <input
              readOnly
              aria-label="time"
              id="wml-share-time"
              className="plain-btn"
              value={timestr.toTimeString(currTime)}
            />
          </div>

          {
            !isMobile
            &&
            <button
              className="plain-btn wml-share-url-cpy"
              aria-haspopup="true"
              aria-controls="wp-embed-modal"
              onClick={openEmbedModal}
            >
              <span tabIndex="-1">
                <i className="material-icons">code</i>EMBED
              </span>
            </button>
          }
        </div>
      </div>
    </div>
  );
}

export default connect(({ watch : { time }, loading }) => ({
  currTime: time
}))(ShareModal);
