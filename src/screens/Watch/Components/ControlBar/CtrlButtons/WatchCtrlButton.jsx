import React from 'react'
import { Popup } from 'semantic-ui-react'

export default function WatchCtrlButton({
  children,
  onClick=null,
  active=false,
  label=""
}) {
  return (
    <Popup inverted wide basic
      position="top center"
      offset="0, 20px"
      mouseEnterDelay={600}
      openOnTriggerClick={false}
      content={label}
      trigger={
        <button 
          className="watch-ctrl-button" 
          onClick={onClick}
          active={active.toString()}
          aria-label={label}
        >
          {children}
        </button>
      }
    />
  )
}