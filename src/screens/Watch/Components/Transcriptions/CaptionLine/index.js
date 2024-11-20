import React, { useRef, useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import * as KeyCode from 'keycode-js';

import {
  transControl,
  prettierTimeStr,
} from '../../../Utils';
import './index.scss';

function CaptionLine({ caption = {}, allowEdit, dispatch, fontSize }) {
  let { text, id, begin, end, kind = "web" } = caption;
  const textRef = useRef();
  const timeRef = useRef();
  const endTimeRef = useRef(); 
  const [timeString, setTimeString] = useState(prettierTimeStr(begin));
  const [endTimeString, setEndTimeString] = useState(prettierTimeStr(end)); // Initialize with correct end time
  const [isHovered, setIsHovered] = useState(false);

  const validateTimeFormat = (input) => {
    // console.log(`Validating time format: ${input}`); // Debugging line
    const parts = input.split(':');
    if (parts.length === 3 || parts.length === 2 || parts.length === 1) {
      return true;
    }
    throw new Error('Invalid time format');
  };


  const convertTimeToSeconds = (time) => {
    const parts = time.split(':').map(Number);
    let totalSeconds = 0;
  
    // Assuming the format is hh:mm:ss or mm:ss
    if (parts.length === 3) {
      totalSeconds += parts[0] * 3600; // hours
      totalSeconds += parts[1] * 60;    // minutes
      totalSeconds += parts[2];         // seconds
    } else if (parts.length === 2) {
      totalSeconds += parts[0] * 60;    // minutes
      totalSeconds += parts[1];         // seconds
    } else if (parts.length === 1) {
      totalSeconds += parts[0];         // seconds
    } else {
      throw new Error('Invalid time format');
    }
  
    return totalSeconds;
  };


  const blurFromInput = (ref) => {
    if (ref && ref.current && typeof ref.current.blur === 'function') {
      if (document.activeElement.id === ref.current.id) {
        ref.current.blur();
        // console.log(`Blurred input: ${ref.current.id}`); // Debugging line
      }
    }
  };

  const handleSeek = () => {
    try {
      validateTimeFormat(timeString);
      const timeInSeconds = convertTimeToSeconds(timeString); // Convert time to seconds
      // console.log(`Seeking to time: ${timeInSeconds}`); // Debugging line
      dispatch({ type: 'watch/media_setCurrTime', payload: timeInSeconds });
    } catch (error) {
      console.error('Error in handleSeek:', error);
    }
  };

  const handleChange = (ref) => {
    // console.log(`Input changed: ${ref.current.innerText}`); // Debugging line
  };

  const handleFocus = ({ target }) => {
    dispatch({ type: 'watch/setTransEditMode', payload: { caption, innerText: target.innerText } });
    // console.log(`Focused on: ${target.id}`); // Debugging line
  };

  const handleBlur = (ref, originalValue) => {
    // if (ref.current && document.activeElement.id === ref.current.id) {
    if (ref.current) {
      // setTimeString(originalValue);
      ref.current.innerText = originalValue;
      transControl.handleBlur();
      // console.log(`Blurred ${ref.current.id}, restored value: ${originalValue}`); // Debugging line
    }
  };

  const handleSave = () => {
    const newText = textRef.current.innerText;
    try {
      // console.log(`begin: ${begin} end: ${end}`); // Debugging line
      validateTimeFormat(timeRef.current.innerText);
      validateTimeFormat(endTimeRef.current.innerText);
      // console.log(`handleSave: before editing: ${newText} at time: ${timeString} with end time: ${endTimeString}`); // Debugging line
      dispatch({ type: 'watch/saveCaption', payload: { caption, text: newText, begin: timeRef.current.innerText, end: endTimeRef.current.innerText } });
      setTimeString(timeRef.current.innerText);
      setEndTimeString(endTimeRef.current.innerText);
      textRef.current.innerText = newText;
      // console.log(`handleSave: after editing: ${newText} at time: ${timeString} with end time: ${endTimeString}`); // Debugging line

    } catch (error) {
      console.error('Invalid time format');
      alert('Please enter a valid time format (HH:MM:SS or MM:SS or SS)');
      timeRef.current.innerText = timeString;
      endTimeRef.current.innerText = endTimeString;
    }
  };

  const handleCancel = () => {
    // console.log("Canceling operations"); // Debugging line
    textRef.current.innerText = text;
    timeRef.current.innerText = timeString;
    endTimeRef.current.innerText = endTimeString; // Restore original end time
    dispatch({ type: 'watch/setCurrEditing', payload: null });
  };

  const handleKeyDown = (e, ref) => {
    if (e.keyCode === KeyCode.KEY_RETURN && !e.shiftKey) {
      e.preventDefault();
      handleSave();
      blurFromInput(ref);
    }
  };

  const handleAddCaption = () => {
    const newCaption = {
      index: -1,
      begin: end,
      end: end,
      text: '',
      transcriptionId: '',
      captionType: 0,
      upVote: 0,
      downVote: 0,
    };
    // console.log("Adding New Caption:", newCaption);
    dispatch({ type: 'watch/addCaption', payload: newCaption });
  };

  const handleAddAudioDescription = () => {
    const newCaption = {
      index: -1,
      begin: end,
      end: end,
      text: '',
      transcriptionId: '',
      captionType: 1,
      upVote: 0,
      downVote: 0,
    };
    // console.log("Adding New Audio Description:", newCaption);
    dispatch({ type: 'watch/addCaption', payload: newCaption });
  };

  const hasUnsavedChanges = (textRef.current && textRef.current.innerText !== text) || 
                            (timeRef.current && timeRef.current.innerText !== timeString) ||
                            (endTimeRef.current && endTimeRef.current.innerText !== endTimeString);

  return (
    <div
      id={`caption-line-${id}`}
      className="watch-caption-line"
      kind={kind}
      data-unsaved={hasUnsavedChanges}
      onMouseEnter={ () => setIsHovered(true) }
      onMouseLeave={ () => setIsHovered(false) }
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
          onInput={() => handleChange(timeRef)}
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
          onInput={() => handleChange(textRef)}
          onKeyDown={(e) => handleKeyDown(e, textRef)}
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
          onFocus={handleFocus}
          onBlur={() => handleBlur(endTimeRef, endTimeString)}
          onInput={() => handleChange(endTimeRef)}
          onKeyDown={(e) => handleKeyDown(e, endTimeRef)}
          aria-label={`Edit end time: ${endTimeString}`}
          spellCheck={false}
        >
          {endTimeString}
        </div>
      </div>

      {isHovered && (
        <div className="add-caption-buttons">
          <button
            className="add-caption-btn"
            onClick={handleAddCaption}
            aria-label="Add Caption"
          >
            Add Caption
          </button>
          <button
            className="add-caption-btn"
            onClick={handleAddAudioDescription}
            aria-label="Add Audio Description"
          >
            Add Description
          </button>
        </div>
      )}

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
          className="plain-btn caption-line-cancel-btn"
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
