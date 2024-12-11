import React, { useRef, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';

import { prettierTimeStr } from '../../../Utils';
import './index.scss';

function CaptionLine({ caption = {}, allowEdit, dispatch, fontSize }) {
  const { text, id, begin, end, kind = "web" } = caption;

  const startTimeRef = useRef();
  const endTimeRef = useRef();
  const textRef = useRef();


  const [fullBeginTime, setFullBeginTime] = useState(begin);
  const [fullEndTime, setFullEndTime] = useState(end);
  const [savedText, setSavedText] = useState(text);
  const [violations, setViolations] = useState([]);
  const [isTextInvalid, setIsTextInvalid] = useState(false);

  const [displayedStartTime, setDisplayedStartTime] = useState(prettierTimeStr(begin, false));
  const [displayedEndTime, setDisplayedEndTime] = useState(prettierTimeStr(end, false));

  const validateTimeFormat = (input) => {
    const timeRegex = /^(\d{1,2}:)?\d{1,2}:\d{2}(\.\d+)?$/;
    if (!timeRegex.test(input)) {
      throw new Error('Invalid time format');
    }
    return true;
  };

  const validateText = (input) => {
    const MAX_LINE_LENGTH = 42; 
    let lines = [];
    let violations = [];
  
    const splitText = (text) => {
      let currentLine = '';
      let words = text.split(' ');
      let currentLineLength = 0;
  
      console.log(`Processing text: "${text}"`);
  
      words.forEach((word) => {
        if (currentLineLength + word.length + (currentLineLength > 0 ? 1 : 0) > MAX_LINE_LENGTH) {
          lines.push(currentLine.trim());
          currentLine = word;
          currentLineLength = word.length;
        } else {
          if (currentLineLength > 0) {
            currentLine += ' ';
            currentLineLength += 1; 
          }
          currentLine += word;
          currentLineLength += word.length;
        }
      });
  
      if (currentLine) {
        lines.push(currentLine.trim());
      }
    };
    splitText(input);
  
    console.log(`Lines after split: ${JSON.stringify(lines)}`);
  
    lines.forEach((line, index) => {
      if (line.length > MAX_LINE_LENGTH) {
        violations.push(`Line ${index + 1} exceeds the max character length.`);
      }
    });
  
    if (input.length <= MAX_LINE_LENGTH && lines.length > 1) {
      violations.push("Text is incorrectly flagged as multi-line for a short subtitle.");
    }

    if (lines.length > 2) {
      violations.push('Text exceeds two lines.');
    }
  
    console.log(`Violations: ${JSON.stringify(violations)}`);
  
    return { lines, violations };
  };
  

  // The control flow is that a change to time is saved in handleTimeKeyDown,
  // which triggers handleSave, which then changes the displayedTime to the correct truncated time
  const handleSave = () => {
    const { lines, violations: textViolations } = validateText(savedText);
  
    const beginTime = parseFloat(fullBeginTime.replace(/:/g, ''));
    const endTime = parseFloat(fullEndTime.replace(/:/g, ''));
    const duration = endTime - beginTime;
  
    const durationViolations = [];
    if (duration < 1.5) {
      durationViolations.push('Caption duration is too short (less than 1.5 seconds).');
    } else if (duration > 6) {
      durationViolations.push('Caption duration is too long (more than 6 seconds).');
    }
  
    const allViolations = [...textViolations, ...durationViolations];
  
    dispatch({
      type: 'watch/saveCaption',
      payload: { caption, text: lines.join('\n'), begin: fullBeginTime, end: fullEndTime },
    });
    setDisplayedStartTime(prettierTimeStr(fullBeginTime, false));
    setDisplayedEndTime(prettierTimeStr(fullEndTime, false));
    setViolations(allViolations);
    setIsTextInvalid(allViolations.length > 0);
  };
  

  useEffect(() => {
    handleSave()
  }, [savedText, fullBeginTime, fullEndTime])

  // NOTE: ALL editable text boxes reset the value to the original if the textbox loses focus
  // Users MUST hit enter for their changes to not be lost
  const handleTimeBlur = (setDisplayedTime, originalValue) => {
    setDisplayedTime(prettierTimeStr(originalValue, false));
  };

  // Ideally, you could do something like setSavedText(savedText), akin to how handleTextKeyDown
  // lazy updates savedText, but this won't trigger a DOM update, so we have to do manually
  // update the DOM
  const handleTextBlur = () => {
    if (textRef.current) {
      // textRef.current.innerText = savedText
      const { lines, violations: newViolations } = validateText(savedText);
      textRef.current.innerText = lines.join('\n');
      setViolations(newViolations);
      setIsTextInvalid(newViolations.length > 0);
    }
  };

  const handleTimeFocus = (fullTime, setDisplayedTime) => {
    setDisplayedTime(prettierTimeStr(fullTime, true));
    dispatch({
      type: 'watch/setTransEditMode',
      payload: { caption, innerText: fullTime },
    });
  };

  const handleTextFocus = () => {
    dispatch({
      type: 'watch/setTransEditMode',
      payload: { caption },
    });
  };

  const handleTimeKeyDown = (e, ref, setFullTime) => {
    if (ref.current) {
      if (e.keyCode === KeyCode.KEY_ESCAPE) {
        e.preventDefault();
        ref.current.blur();
      } else if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
        e.preventDefault();
        const currentValue = ref.current?.innerText || "";
        try {
          validateTimeFormat(currentValue);
          setFullTime(currentValue);
        } catch (error) {
          dispatch({
            type: 'watch/timestampFailed',
            payload: { caption },
          });
        }
        ref.current.blur();
      }
    }
  }

  const handleTextKeyDown = (e, ref) => {
    if (ref.current) {
      if (e.keyCode === KeyCode.KEY_ESCAPE) {
        ref.current.blur();
        return;
      }
      if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
        e.preventDefault();
        const currentValue = textRef.current?.innerText || "";
        setSavedText(currentValue);
        ref.current.blur();
      }
    }
  }

  return (
    <div
      id={`caption-line-${id}`}
      className={`watch-caption-line ${isTextInvalid ? 'invalid-text' : ''}`}
      kind={kind}
      data-unsaved
    >
      <div className="caption-line-content">
        {/* Editable Start Time */}
        <div
          ref={startTimeRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-time-${id}`}
          className="caption-line-time-display"
          onFocus={() => { handleTimeFocus(fullBeginTime, setDisplayedStartTime) }}
          onBlur={() => { handleTimeBlur(setDisplayedStartTime, fullBeginTime) }}
          onKeyDown={(e) => { handleTimeKeyDown(e, startTimeRef, setFullBeginTime) }}
          spellCheck={false}
        >
          {displayedStartTime}
        </div>

        {/* Editable Text */}
        <div
          ref={textRef}
          suppressContentEditableWarning
          contentEditable={allowEdit && !isMobile}
          role="textbox"
          tabIndex={0}
          id={`caption-line-textarea-${id}`}
          className={`caption-line-text-${fontSize} ${isTextInvalid ? 'invalid-text' : ''}`}
          spellCheck={false}
          onFocus={handleTextFocus}
          onBlur={() => { handleTextBlur(text) }}
          onKeyDown={(e) => { handleTextKeyDown(e, textRef) }}
        >
          {savedText}
        </div>
        <div className="violations">
          <span className="tooltip">{violations.join(', ')}</span>
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
          onFocus={() => { handleTimeFocus(fullEndTime, setDisplayedEndTime) }}
          onBlur={() => { handleTimeBlur(setDisplayedEndTime, fullEndTime) }}
          onKeyDown={(e) => { handleTimeKeyDown(e, endTimeRef, setFullEndTime) }}
          spellCheck={false}
        >
          {displayedEndTime}
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
