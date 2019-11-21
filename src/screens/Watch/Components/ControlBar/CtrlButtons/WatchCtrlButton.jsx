import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function WatchCtrlButton({
  children,
  position="bottom",
  classNames='',
  onClick=null,
  active=false,
  colored=false,
  label="",
  ariaTags={},
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
      position={`${position} center`}
      offset={position === 'bottom' ? "0, 15px" : undefined}
      mouseEnterDelay={mouseEnterDelay}
      openOnTriggerClick={false}
      openOnTriggerFocus
      closeOnTriggerBlur
      content={<strong>{label}</strong>}
      trigger={
        <button 
          id={id}
          className={`watch-ctrl-button ${classNames}`} 
          active={active.toString()}
          colored={colored.toString()}
          position={position}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...ariaTags}
        >
          {children}
        </button>
      }
    />
  )
}