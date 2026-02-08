import React, { useRef, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';
import {
  WEBVTT_SUBTITLES,
  // unused WEBVTT_DESCRIPTIONS,
} from '../../../Utils/constants.util';
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
    let violationArr = [];
  
    const splitText = (textInput) => {
      let currentLine = '';
      let words = textInput.split(' ');
      let currentLineLength = 0;
    
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
    
    lines.forEach((line, index) => {
      if (line.length > MAX_LINE_LENGTH) {
        violationArr.push(`Line ${index + 1} exceeds the max character length.`);
      }
    });
  
    if (input.length <= MAX_LINE_LENGTH && lines.length > 1) {
      violationArr.push("Text is incorrectly flagged as multi-line for a short subtitle.");
    }

    if (lines.length > 2) {
      violationArr.push('Text exceeds two lines.');
    }
    
    return { lines, violationArr };
  };
  

  const handleSave = () => {
    const { lines, violationArr = [] } = validateText(savedText); 
    const parseTime = (timeStr) => {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      const [sec, ms] = seconds.toString().split('.');
      return hours * 3600 + minutes * 60 + (Number(sec) || 0) + (ms ? parseFloat(`0.${ms}`) : 0);
    };
  
    const beginTime = parseTime(fullBeginTime);
    const endTime = parseTime(fullEndTime);
    const duration = endTime - beginTime;
  
    const durationViolations = [];
    if (duration < 1.5) {
      durationViolations.push('Caption duration is too short (less than 1.5 seconds).');
    } else if (duration > 6) {
      durationViolations.push('Caption duration is too long (more than 6 seconds).');
    }
    
    const allViolations = [...violationArr, ...durationViolations];
  
    dispatch({
      type: 'watch/saveCaption',
      payload: { caption, text: lines.join('\n'), begin: fullBeginTime, end: fullEndTime },
    });
    setDisplayedStartTime(prettierTimeStr(fullBeginTime, false));
    setDisplayedEndTime(prettierTimeStr(fullEndTime, false));
    if(kind === WEBVTT_SUBTITLES) {
      setViolations(allViolations);
      setIsTextInvalid(allViolations.length > 0);
    }  
  };
  

  useEffect(() => {
    handleSave()
  }, [savedText, fullBeginTime, fullEndTime])

  const handleTimeBlur = (setDisplayedTime, originalValue) => {
    setDisplayedTime(prettierTimeStr(originalValue, false));
  };

  const handleTextBlur = () => {
    if (textRef.current) {
      const { lines } = validateText(savedText); // unused violationArr = [] 
      textRef.current.innerText = lines.join('\n');
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
      onFocus={() => setIsTextInvalid(violations.length > 0)}
      onBlur={() => setIsTextInvalid(false)} 
    >
      <div className="caption-line-content">
        {/* Triangle indicator */}
        {(violations.length > 0 && kind === WEBVTT_SUBTITLES) && (
          <div className="triangle-indicator" />
        )}
  
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
  
        <div className={`violations ${violations.length > 0 ? 'show-tooltip' : ''}`}>
          {violations.length > 0 && <span className="tooltip">{violations.join(', ')}</span>}
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
    </div>
  );    
}

export default CaptionLine;
