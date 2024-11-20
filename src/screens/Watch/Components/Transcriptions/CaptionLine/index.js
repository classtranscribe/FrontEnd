import React, { useRef, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';

import { transControl, prettierTimeStr } from '../../../Utils';
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

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Full Begin Time Updated:", fullBeginTime);
  }, [fullBeginTime]);

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log("Full End Time Updated:", fullEndTime);
  }, [fullEndTime]);

  const validateTimeFormat = (input) => {
    const timeRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}(\.\d+)?$/;
    if (!timeRegex.test(input)) {
      throw new Error('Invalid time format');
    }
    return true;
  };

  const handleCancel = () => {
    textRef.current.innerText = text;
    timeRef.current.innerText = prettierTimeStr(fullBeginTime);
    endTimeRef.current.innerText = prettierTimeStr(fullEndTime);
    dispatch({ type: 'watch/setCurrEditing', payload: null });
  };

  const handleSave = (updatedBeginTime = fullBeginTime, updatedEndTime = fullEndTime) => {
    const newText = textRef.current.innerText;
  
    try {
      // eslint-disable-next-line no-console
      console.log("Handle save triggered");
      // eslint-disable-next-line no-console
      console.log("Using begin time:", updatedBeginTime);
      // eslint-disable-next-line no-console
      console.log("Using end time:", updatedEndTime);
  
      validateTimeFormat(updatedBeginTime);
      validateTimeFormat(updatedEndTime);
      dispatch({
        type: 'watch/saveCaption',
        payload: { caption, text: newText, begin: updatedBeginTime, end: updatedEndTime },
      });
      setTimeString(prettierTimeStr(updatedBeginTime));
      setEndTimeString(prettierTimeStr(updatedEndTime));
      // eslint-disable-next-line no-console
      console.log("Time strings updated to:", prettierTimeStr(updatedBeginTime), prettierTimeStr(updatedEndTime));
      textRef.current.innerText = newText;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Error during save:", error.message);
      alert('Please enter a valid time format (HH:MM:SS, MM:SS, or HH:MM:SS.SSS)');  // eslint-disable-line no-alert
    }
  };

  const handleBlur = (ref, originalValue, setFullTime) => {
    if (ref.current) {
      const elementId = ref.current?.id || "";
      const currentValue = ref.current.innerText;
      if (elementId.includes("time")) {
        // time
        try {
          validateTimeFormat(currentValue); 
          setFullTime((prev) => {
            // eslint-disable-next-line no-console
            console.log("Updating time:", currentValue);
            // eslint-disable-next-line no-console
            console.log(`${prev}`);
            return currentValue;
          });
          ref.current.innerText = prettierTimeStr(currentValue);
        } catch {
          // eslint-disable-next-line no-console
          console.warn("Invalid time format. Reverting to original value:", originalValue);
          ref.current.innerText = prettierTimeStr(originalValue);
        }
      } else if (elementId.includes("textarea")) {
        // text
        // eslint-disable-next-line no-console
        console.log("handling blur for text");
        ref.current.innerText = currentValue.trim();
      }
    }
  
    transControl.handleBlur(); 
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

  const handleKeyDown = (e, ref, setFullTime) => {
    // eslint-disable-next-line no-console
    console.log("Key down event:", e.keyCode);
    if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
      e.preventDefault();
      const elementId = ref.current?.id || "";
      const currentTime = ref.current?.innerText || "";
      // eslint-disable-next-line no-console
      console.log("Element ID:", elementId);
      // eslint-disable-next-line no-console
      console.log("Current time value from input:", currentTime);
      if (elementId.includes("time")) {
        // time
        try {
          validateTimeFormat(currentTime); 
          setFullTime(currentTime); 
          // eslint-disable-next-line no-console
          console.log("Updated full time (pending state):", currentTime);
          if (elementId.includes("end")) {
            handleSave(fullBeginTime, currentTime);
          } else {
            handleSave(currentTime, fullEndTime);
          }
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error("Invalid time format during keydown:", error.message);
          alert('Please enter a valid time format (HH:MM:SS, MM:SS, or HH:MM:SS.SSS)');  // eslint-disable-line no-alert
        }
      } else if (elementId.includes("textarea")) {
        // text
        // eslint-disable-next-line no-console
        console.log("saving text");
        handleSave();
      }
  
      ref.current.blur();
    }
  };
  

  const hasUnsavedChanges =
    (textRef.current && textRef.current.innerText !== text) ||
    (timeRef.current && fullBeginTime !== begin) ||
    (endTimeRef.current && fullEndTime !== end);

  return (
    <div
      id={`caption-line-${id}`}
      className="watch-caption-line"
      kind={kind}
      data-unsaved={hasUnsavedChanges}
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
          onBlur={() => handleBlur(timeRef, fullBeginTime, setFullBeginTime)}
          onKeyDown={(e) => handleKeyDown(e, timeRef, setFullBeginTime)}
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
          onBlur={() => handleBlur(textRef, text, () => {})}
          onKeyDown={(e) => handleKeyDown(e, textRef, () => {})}
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
          onBlur={() => handleBlur(endTimeRef, fullEndTime, setFullEndTime)}
          onKeyDown={(e) => handleKeyDown(e, endTimeRef, setFullEndTime)}
          spellCheck={false}
        >
          {endTimeString}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="caption-line-btns">
        {hasUnsavedChanges && (
          <div className="mt-2 mr-3 caption-line-prompt">Return (save changes). Shift-Return (newline)</div>
        )}
        <button className="plain-btn caption-line-save-btn" onClick={handleSave}>
          Save
        </button>
        <button className="plain-btn caption-line-cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CaptionLine;
