import React, { useRef } from 'react'
import { Popup } from 'semantic-ui-react'

import {
  transControl,
  videoControl,
  timeStrToSec,
  prettierTimeStr,
  autoSize,
  WEBVTT_DESCRIPTIONS
} from '../../../Utils'
import './index.css'

function CaptionLine({
  isCurrent=false,
  isEditing=false,
  shouldHide=false,
  caption={},
}) {

  const { text='', id, begin, index, kind } = caption
  const ref = useRef()

  const handleSeek = () => {
    let time = timeStrToSec(begin)
    videoControl.currTime(time)
  }

  const handleChange = ({ target }) => {
    transControl.handleChange(target.value)
    // console.log(target.value)
  }

  const handleFocus = e => {
    transControl.edit(caption)
    autoSize(ref.current)
  }

  const handleBlur = () => {
    transControl.handleBlur()
    transControl.edit(null)
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
      kind={kind}
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
          }/>

        {
          kind === WEBVTT_DESCRIPTIONS ?
          <div className="description-line-text">
            {text}<br/>
            <span className="description-line-text-title">(Description)</span>
          </div>
          :
          <Popup inverted wide basic
            position="top center"
            openOnTriggerClick={false}
            openOnTriggerFocus
            closeOnTriggerBlur
            content={isEditing ? 'Hit return to save changes.' : 'Click to modify this caption!'}
            trigger={
              <textarea   
                ref={ref}
                rows='2'
                id={`caption-line-textarea-${id}`}
                className="caption-line-text"
                aria-label={`(${index}) Edit caption at ${timeStr} (Hit return to save changes)`} 
                spellCheck={false}
                defaultValue={text} 
                onFocus={handleFocus}
                onBlur={handleBlur}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
              />
            }/>
        }
      </div>
      <div className="caption-line-btns">
        <button 
          className="plain-btn caption-line-save-btn" 
          onClick={handleSave}
          tabIndex={-1}
          aria-hidden={true}
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default CaptionLine