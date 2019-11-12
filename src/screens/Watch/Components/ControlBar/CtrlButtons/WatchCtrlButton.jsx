import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function WatchCtrlButton({
  children,
  onClick=null,
  active=false,
  colored=false,
  label="",
  ariaLabel="",
  mouseEnterDelay=0,
  id=""
}) { 
  const handleClick = () => {
    if (onClick) onClick()
  }

  const handleKeyDown = e => {
    if (e.keyCode === 32) {
      e.preventDefault()
    }
  }

  return (
    <Popup inverted wide basic
      position="top center"
      offset="0, 20px"
      mouseEnterDelay={mouseEnterDelay}
      openOnTriggerClick={false}
      openOnTriggerFocus
      closeOnTriggerBlur
      content={label}
      trigger={
        <button 
          id={id}
          className="watch-ctrl-button" 
          active={active.toString()}
          colored={colored.toString()}
          aria-label={ariaLabel}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {children}
        </button>
      }
    />
  )
}