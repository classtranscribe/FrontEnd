import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function WatchCtrlButton({
  children,
  onClick=null,
  active=false,
  label="",
  popup=true
}) { 
  const handleClick = () => {
    document.activeElement.blur()
    if (onClick) onClick()
  }

  return popup ? (
    <Popup inverted wide basic
      position="top center"
      offset="0, 20px"
      // mouseEnterDelay={600}
      openOnTriggerClick={false}
      content={label}
      trigger={
        <button 
          className="watch-ctrl-button" 
          onClick={handleClick}
          active={active.toString()}
          aria-label={label}
        >
          {children}
        </button>
      }
    />
  ) : (
    <button 
      className="watch-ctrl-button" 
      onClick={handleClick}
      active={active.toString()}
      aria-label={label}
    >
      {children}
    </button>
  )
}