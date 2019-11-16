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
  captionIndex=null,
  caption={},
}) {

  const { text='', id, begin, index } = caption
  const [value, setValue] = useState(text)
  const ref = useRef()
  // useEffect(() => {
  //   if (Math.abs( currentIdx - index ) <= 25) {
  //     autoSize(ref.current)
  //   }
  // }, [value, caption])

  const handleSeek = () => {
    let time = timeStrToSec(begin)
    videoControl.currTime(time)
  }
  const handleChange = ({ target }) => {
    setValue(target.value)
    // console.log(target.value)
  }
  const handleFocus = e => {
    transControl.editCaption(caption)
    autoSize({ target: ref.current })
  }
  const handleBlur = () => {
    // onEditing(null)
    transControl.handleBlur()
  }
  const handleSave = () => {
    if (typeof captionIndex !== 'number' || value === text) {
      return transControl.editCaption(null)
    }
    transControl.saveEdition(value, captionIndex)
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
          onKeyDown={autoSize}
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