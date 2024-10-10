import React, { useRef, useState } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';

import {
  transControl,
  timeStrToSec,
  prettierTimeStr,
} from '../../../Utils';
import './index.scss';

function CaptionLine({ caption = {}, allowEdit, dispatch, fontSize }) {
  let { text, id, begin, kind = "web" } = caption;
  const textRef = useRef();
  const timeRef = useRef();
  const [timeString, setTimeString] = useState(prettierTimeStr(begin));

  const convertTime = (input) => {
    if (typeof input === 'number') {
      return input;
    }
    const parts = input.split(':');
    if (parts.length === 3) { // HH:MM:SS
      return parseInt(parts[0], 10) * 3600 + parseInt(parts[1], 10) * 60 + parseInt(parts[2], 10);
    }
    if (parts.length === 2) { // MM:SS
      return parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    if (parts.length === 1) { // SS
      return parseInt(parts[0], 10);
    }
    throw new Error('Invalid time format');
  };
  

  const prettyTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0') }`;
  };

  const blurFromInput = (ref) => {
    if (ref && ref.current && typeof ref.current.blur === 'function') {
      if (document.activeElement.id === ref.current.id) {
        ref.current.blur();
      }
    }
  };

  const handleSeek = () => {
    try {
      const time = convertTime(timeString);
      dispatch({ type: 'watch/media_setCurrTime', payload: time });
    } catch (error) {
      console.error('Error in handleSeek:', error);
    }
  };

  const handleChange = () => {
    // console.log(target.innerText)
  };

  const handleFocus = ({ target }) => {
    dispatch({ type: 'watch/setTransEditMode', payload: { caption, innerText: target.innerText } })
  };

  const handleBlur = (ref, originalValue) => {
    ref.current.innerText = originalValue;
    transControl.handleBlur();
  };

  const handleSave = () => {
    const newText = textRef.current.innerText;
    try {
      const newBegin = convertTime(timeRef.current.innerText);
      // eslint-disable-next-line no-console
      console.log(newBegin.toString()); // to see if local changes are being recognized and dispatched
      dispatch({ type: 'watch/saveCaption', payload: { caption, text: newText, begin: newBegin } });
    } catch (error) {
      console.error('Invalid time format');
      timeRef.current.innerText = timeString;
    }
  };

  const handleCancel = () => {
    // eslint-disable-next-line no-console
    console.log("canceling operations");
    textRef.current.innerText = text;
    timeRef.current.innerText = timeString;
    dispatch({ type: 'watch/setCurrEditing', payload: null })
  };

  const handleKeyDown = (e, ref) => {
    if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
      e.preventDefault();
      handleSave();
      blurFromInput(ref);
    }
  };

  const hasUnsavedChanges = (textRef.current && textRef.current.innerText !== text) || 
                            (timeRef.current && timeRef.current.innerText !== timeString);

  return (
    <div
      id={`caption-line-${id}`}
      className="watch-caption-line"
      kind={kind}
      data-unsaved={hasUnsavedChanges}
    >
      <div className="caption-line-content">
        {/* Editable Time */}
        <div
          ref={timeRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-time-${id}`}
          className="caption-line-time-display"
          onFocus={handleFocus}
          onBlur={() => handleBlur(timeRef, timeString)}
          onInput={handleChange}
          onKeyDown={(e) => handleKeyDown(e, timeRef)}
          onClick={handleSeek}
          aria-label={`Edit time: ${timeString}`}
          spellCheck={false}
        >
          {timeString}
        </div>

        <div
          ref={textRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-textarea-${id}`}
          className={`caption-line-text-${fontSize}`}
          onFocus={handleFocus}
          onBlur={() => handleBlur(textRef, text)}
          onInput={handleChange}
          onKeyDown={(e) => handleKeyDown(e, textRef)}
          spellCheck={false}
        >
          {text}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="caption-line-btns">
        {hasUnsavedChanges && (
          <div className="mt-2 mr-3 caption-line-prompt">Return (save changes). Shift-Return (newline)</div>
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
