import React, { useState } from 'react'
import { Popup } from 'semantic-ui-react'

import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
  autosize
} from '../../../Utils'
import './index.css'

function CaptionLine({
  isCurrent=false,
  isEditing=false,
  caption={},
  onEditing,
  onSave,
}) {

  const { text='', id, begin } = caption
  const [value, setValue] = useState(text)

  const handleSeek = () => {
    let time = timeStrToSec(begin)
    videoControl.currTime(time)
  }
  const handleChange = ({ target }) => {
    setValue(target.value)
    console.log(target.value)
  }
  const handleFocus = e => {
    onEditing(caption)
  }
  const handleBlur = () => {
    onEditing(null)
  }
  const handleSave = () => {
    onSave(value)
  }

  const timeStr = prettierTimeStr(begin)

  return (
    <div 
      id={`caption-line-${id}`} 
      className="watch-caption-line" 
      current={isCurrent.toString()}
      editing={isEditing.toString()}
    >
      <div className="caption-line-content">
        <Popup inverted wide basic
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          content={`Jump to ${timeStr}`}
          trigger={
            <div 
              className="caption-line-time-display" 
              tabIndex={0}
              onClick={handleSeek}
            >
              {timeStr}
            </div>
          }
        />
        <textarea   
          className="caption-line-text" 
          rows='1'
          defaultValue={text} 
          onFocus={handleFocus}
          onBlur={handleBlur}
          ct-textarea
          onChange={handleChange}
          onKeyDown={autosize}
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