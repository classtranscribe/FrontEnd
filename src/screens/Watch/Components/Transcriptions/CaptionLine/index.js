import React, { useRef, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';

import { prettierTimeStr } from '../../../Utils';
import './index.scss';

function CaptionLine({ caption = {}, allowEdit, dispatch, fontSize }) {
  const { text, id, begin, end, kind = "web" } = caption;
  const textRef = useRef();
  const timeRef = useRef();
  const endTimeRef = useRef();

  const [fullBeginTime, setFullBeginTime] = useState(begin);
  const [fullEndTime, setFullEndTime] = useState(end);

  const [timeString, setTimeString] = useState(prettierTimeStr(begin));
  const [endTimeString, setEndTimeString] = useState(prettierTimeStr(end));

  const validateTimeFormat = (input) => {
    const timeRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}(\.\d+)?$/;
    if (!timeRegex.test(input)) {
      throw new Error('Invalid time format');
    }
    return true;
  };

  const handleSave = () => {
    const newText = textRef.current.innerText;
    const newBeginTime = timeRef.current.innerText;
    const newEndTime = endTimeRef.current.innerText;
    try {
      validateTimeFormat(newBeginTime);
      validateTimeFormat(newEndTime);
      dispatch({
        type: 'watch/saveCaption',
        payload: { caption, text: newText, begin: newBeginTime, end: newEndTime },
      });
      setTimeString(prettierTimeStr(newBeginTime));
      setEndTimeString(prettierTimeStr(newEndTime));
      textRef.current.innerText = newText;
    } catch (error) {
      // TODO: add reactful alert here if timestring is badly formatted
    }
  };

  // NOTE: ALL editable text boxes reset the value to the original if the textbox loses focus
  // Users MUST hit enter for their changes to not be lost
  const handleTextBlur = (ref, originalValue) => {
    if (ref.current) {
      ref.current.innerText = originalValue;
    }
  };

  const handleTimeBlur = (ref, originalValue) => {
    if (ref.current) {
      ref.current.innerText = prettierTimeStr(originalValue);
    }
  };

  const handleFocus = (ref, fullTime) => {
    if (ref.current) {
      ref.current.innerText = prettierTimeStr(fullTime, true);
      dispatch({
        type: 'watch/setTransEditMode',
        payload: { caption, innerText: ref.current.innerText },
      });
    }
  };

  const handleTimeKeyDown = (e, ref, setFullTime) => {
    if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
      e.preventDefault();
      const currentTime = ref.current?.innerText || "";
      try {
        validateTimeFormat(currentTime);
        setFullTime(currentTime);
        handleSave();
      } catch (error) {
        // TODO: add reactful alert here if timestring is badly formatted
      }
      ref.current.blur();
    }
  }

  const handleTextKeyDown = (e, ref) => {
    if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
      handleSave();
      ref.current.blur();
    }
  }

  return (
    <div
      id={`caption-line-${id}`}
      className="watch-caption-line"
      kind={kind}
      data-unsaved
    >
      <div className="caption-line-content">
        {/* Editable Start Time */}
        <div
          ref={timeRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-time-${id}`}
          className="caption-line-time-display"
          onFocus={() => handleFocus(timeRef, fullBeginTime)}
          onBlur={() => handleTimeBlur(timeRef, fullBeginTime)}
          onKeyDown={(e) => handleTimeKeyDown(e, timeRef, setFullBeginTime)}
          spellCheck={false}
        >
          {timeString}
        </div>

        {/* Editable Text */}
        <div
          ref={textRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-textarea-${id}`}
          className={`caption-line-text-${fontSize}`}
          onFocus={() => dispatch({ type: 'watch/setTransEditMode', payload: { caption } })}
          onBlur={() => handleTextBlur(textRef, text)}
          onKeyDown={(e) => handleTextKeyDown(e, textRef)}
          spellCheck={false}
        >
          {text}
        </div>

        {/* Editable End Time */}
        <div
          ref={endTimeRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-end-time-${id}`}
          className="caption-line-time-display"
          onFocus={() => handleFocus(endTimeRef, fullEndTime)}
          onBlur={() => handleTimeBlur(endTimeRef, fullEndTime)}
          onKeyDown={(e) => handleTimeKeyDown(e, endTimeRef, setFullEndTime)}
          spellCheck={false}
        >
          {endTimeString}
        </div>
      </div>

      {/* Action Buttons */}
      {/* <div className="caption-line-btns">
        {true && (
          <div className="mt-2 mr-3 caption-line-prompt">Return (save changes). Shift-Return (newline)</div>
        )}
        <button className="plain-btn caption-line-save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="plain-btn caption-line-cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div> */}
    </div>
  );
}

export default CaptionLine;
