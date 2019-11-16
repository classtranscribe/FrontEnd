import React, { useState, useRef } from 'react'
import { Popup } from 'semantic-ui-react'

import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
  autoSize
} from '../../../Utils'
import './index.css'

function CaptionLine({
  isCurrent=false,
  isEditing=false,
  shouldHide=false,
  caption={},
}) {

  const { text='', id, begin, index } = caption
  const [value, setValue] = useState(text)
  const ref = useRef()

  const handleSeek = () => {
    let time = timeStrToSec(begin)
    videoControl.currTime(time)
  }

  const handleChange = ({ target }) => {
    setValue(target.value)
    transControl.handleChange(target.value)
    // console.log(target.value)
  }

  const handleFocus = e => {
    transControl.editCaption(caption)
    autoSize(ref.current)
  }

  const handleBlur = () => {
    transControl.handleBlur()
  }

  const handleSave = () => {
    transControl.saveEdition()
    document.activeElement.blur()
  }

  const handleKeyDown = e => {
    if (e.keyCode === 13) {
      e.preventDefault()
      handleSave()
      ref.current.blur()
    } else {
      autoSize(ref.current)
    }
  }

  const timeStr = prettierTimeStr(begin)

  return (
    <div 
      id={`caption-line-${id}`} 
      className="watch-caption-line" 
      current={isCurrent.toString()}
      editing={isEditing.toString()}
      hide={shouldHide.toString()}
    >
      <div className="caption-line-content">
        <Popup inverted wide basic
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          content={`Jump to ${timeStr}`}
          trigger={
            <button 
              className="plain-btn caption-line-time-display" 
              onClick={handleSeek}
              aria-label={`Jump to ${timeStr}`}
            >
              <span tabIndex="-1">{timeStr}</span>
            </button>
          }
        />
        <textarea   
          ref={ref}
          rows='2'
          id={`caption-line-textarea-${id}`}
          className="caption-line-text"
          aria-label={`(${index}) Edit caption at ${timeStr}`} 
          spellCheck={false}
          defaultValue={text} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <div className="caption-line-btns">
        <button 
          className="plain-btn caption-line-save-btn" 
          onClick={handleSave}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default CaptionLine