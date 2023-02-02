import React from 'react';
import { isMobile } from 'react-device-detect';
import { Popup } from 'semantic-ui-react';
import * as KeyCode from 'keycode-js';
import './index.scss';
import {
  // transControl,
  timeStrToSec,
  prettierTimeStr,
  WEBVTT_DESCRIPTIONS,
} from '../../../Utils';

export default function TranscriptText({ caption = {}, isCurrent = false, dispatch }) {
  const { text = '', id, begin, kind } = caption;

  const handleSeek = () => {
    const time = timeStrToSec(begin);
    dispatch({ type: 'watch/media_setCurrTime', payload: time });
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === KeyCode.KEY_RETURN) {
      handleSeek();
    }
  };

  const timeStr = prettierTimeStr(begin);

  return (
    <Popup
      inverted
      wide
      basic
      position="top left"
      openOnTriggerClick={false}
      openOnTriggerFocus
      closeOnTriggerBlur
      content={timeStr}
      disabled={isMobile}
      trigger={
        <div
          id={`caption-line-${id}`}
          className="article-text"
          kind={kind}
          role="button"
          tabIndex="0"
          current={isCurrent.toString()}
          onClick={handleSeek}
          // onDoubleClick={() => alert('tes')} // maybe for editing in the future ?
          onKeyDown={handleKeyDown}
          // tabIndex="0"
        >
          {kind === WEBVTT_DESCRIPTIONS && (
            <span className="description-line-text-title">
              (Description)
              <br />
            </span>
          )}
          {text}
        </div>
      }
    />
  );
}
