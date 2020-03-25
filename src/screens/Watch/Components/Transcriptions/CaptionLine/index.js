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
import { isMobile } from 'react-device-detect'

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
    console.log(target.innerText)
    transControl.handleChange(target.innerText)
    // console.log(target.value)
  }

  const handleFocus = e => {
    transControl.edit(caption)
    // autoSize(ref.current)
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
      if (ref && ref.current && typeof ref.current.blur === "function") {
        ref.current.blur()
      } 
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
        {/* <Popup inverted wide basic
          openOnTriggerClick={false}
          openOnTriggerFocus
          closeOnTriggerBlur
          content={`Jump to ${timeStr}`}
          trigger={ */}
            <button 
              className="plain-btn caption-line-time-display" 
              onClick={handleSeek}
              aria-label={`Jump to ${timeStr}`}
            >
              <span tabIndex="-1">{timeStr}</span>
            </button>
          {/* }/> */}

        {
          kind === WEBVTT_DESCRIPTIONS ?
          <div className="description-line-text">
            {text}<br/>
            <span className="description-line-text-title">(Description)</span>
          </div>
          :
          //<Popup inverted wide basic
            //position="top center"
            //openOnTriggerClick={false}
            //openOnTriggerFocus
            //closeOnTriggerBlur
            //content={isEditing ? 'Hit return to save changes.' : 'Click to modify this caption!'}
            //trigger={
              <div
                ref={ref}
                contentEditable={!isMobile}
                id={`caption-line-textarea-${id}`}
                className="caption-line-text"
                aria-label={`(${index}) Edit caption at ${timeStr} (Hit return to save changes)`} 
                dangerouslySetInnerHTML={{__html: text}}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onInput={handleChange}
                onKeyDown={handleKeyDown}
                spellCheck={false}
              />
              /*<textarea   
                readOnly={isMobile}
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
              />*/
            //}/>
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

/* 

<div 
  className="caption-line-text"
  id={`caption-line-textarea-${id}`}
  tabIndex={0}
  aria-label={`(${index}) Edit caption at ${timeStr} (Hit return to save changes)`} 
  contentEditable
  onInput={e => handleChange({ target: e.currentTarget.innerText })}
  onFocus={handleFocus}
  onBlur={handleBlur}
  onKeyDown={handleKeyDown}
>
  {text} 
</div> 

*/

export default CaptionLine