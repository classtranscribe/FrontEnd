import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { transControl } from '../../../Utils'

export function ClosedCaptionButtonWithRedux({
  openCC=false,
  captions=[]
}) {

  const handleCCTrigger = () => {
    transControl.handleOpenCC()
  }

  let disabled = captions.length <= 0

  let isOpen = openCC && !disabled

  return (
    <WatchCtrlButton 
      onClick={handleCCTrigger}
      label={disabled ? `No Closed Caption` : `Closed Caption: ${isOpen ? 'ON' : 'OFF'} (c)`}
      id="closed-caption-btn"
      colored={isOpen}
      disabled={disabled}
      ariaTags={{
        'aria-label': `${isOpen ? 'Open' : 'Close'} Closed Caption`,
        //'aria-keyshortcuts': 'c',
        'aria-controls': 'watch-cc-container'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="fas fa-closed-captioning"></i>    
      </span>
    </WatchCtrlButton>
  )
}

export const ClosedCaptionButton = connectWithRedux(
  ClosedCaptionButtonWithRedux,
  ['openCC', 'captions'],
  []
)