import React, { useRef } from 'react';
import { isMobile } from 'react-device-detect';

import {
  transControl,
  timeStrToSec,
  prettierTimeStr,
  WEBVTT_DESCRIPTIONS,
} from '../../../Utils';
import './index.scss';

function CaptionLine({ isCurrent = false, isEditing = false,
  shouldHide = false, caption = {}, dispatch, fontSize }) {
  let { text, id, startTime, begin, kind = "web" } = caption;
  const ref = useRef();

  const blurFromInput = () => {
    if (ref && ref.current && typeof ref.current.blur === 'function') {
      if (document.activeElement.id === ref.current.id) {
        ref.current.blur();
      }
    }
  };

  const handleSeek = () => {
    const time = timeStrToSec(startTime);
    dispatch({ type: 'watch/media_setCurrTime', payload: time })
  };

  const handleChange = ({ target }) => {
    // console.log(target.innerText)
  };

  const handleFocus = ({ target }) => {
    // console.error(e.target.innerText)
    dispatch({ type: 'watch/setTransEditMode', payload: { caption, innerText: target.innerText } })
  };

  const handleBlur = () => {
    transControl.handleBlur();
  };

  const handleSave = (cap) => {
    dispatch({ type: 'watch/saveCaption', payload: { caption, text: ref.current.innerHTML } })
  };

  const handleCancel = () => {
    ref.current.innerHTML = text;
    dispatch({ type: 'watch/setCurrEditing', payload: null })
  };

  const handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      handleSave();
      blurFromInput();
    }
  };

  const timeStr = prettierTimeStr(String(startTime));
  const hasUnsavedChanges = ref && ref.current && ref.current.innerText !== text;
  let roundedTime = Math.round(startTime);
  let beginTime= Math.floor(roundedTime / 60)
  let secondsTime = roundedTime % 60
  let secondsTimeString = String(secondsTime);


  if (secondsTime < 10) {
    secondsTimeString = `0${ String(secondsTime)}`
  }
  let totalTime = `${String(beginTime) }:${ secondsTimeString}`;
  if (begin !== undefined) {
    totalTime = prettierTimeStr(begin)
  }

  return (
    <div
      id={begin === undefined ? `caption-line-${startTime}` :`caption-line-${id}`}
      className="watch-caption-line"
      current={isCurrent.toString()}
      editing={isEditing.toString()}
      hide={shouldHide.toString()}
      kind={kind}
      data-unsaved={hasUnsavedChanges}
    >
      <div className="caption-line-content">
        {/* Time Seeking Button */}
        <button
          className="plain-btn caption-line-time-display"
          onClick={handleSeek}
          aria-label={`Jump to ${timeStr}`}
        >
          <span tabIndex="-1">{totalTime}</span>
        </button>

        {/* Caption Line */}
        {kind === WEBVTT_DESCRIPTIONS ? (
          <div className="description-line-text">
            {text}
            <br />
            <span className="description-line-text-title">(Description)</span>
          </div>
        ) : (
          <div
            ref={ref}
            contentEditable={!isMobile}
            id={`caption-line-textarea-${id}`}
            className={`caption-line-text-${fontSize}`}
            dangerouslySetInnerHTML={{ __html: text }}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onInput={handleChange}
            onKeyDown={handleKeyDown}
            spellCheck={false}
          />
        )}
      </div>

      {/* Action Buttons */}
      <div className="caption-line-btns">
        {hasUnsavedChanges && (
          <div className="mt-2 mr-3 caption-line-prompt">Hit return to save changes</div>
        )}

        {/* Save Button */}
        <button
          className="plain-btn caption-line-save-btn"
          onClick={handleSave}
          tabIndex={-1}
          aria-hidden
        >
          Save
        </button>
        <button
          className="plain-btn caption-line-save-btn"
          onClick={handleCancel}
          tabIndex={-1}
          aria-hidden
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CaptionLine;
