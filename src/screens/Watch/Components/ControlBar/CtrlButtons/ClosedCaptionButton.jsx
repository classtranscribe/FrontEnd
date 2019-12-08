import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { transControl } from '../../../Utils'

export function ClosedCaptionButtonWithRedux({
  openCC=false,
}) {

  const handleCCTrigger = () => {
    transControl.handleOpenCC()
  }

  return (
    <WatchCtrlButton 
      onClick={handleCCTrigger}
      label={`Closed Caption: ${openCC ? 'ON' : 'OFF'} (c)`}
      id="closed-caption-btn"
      colored={openCC}
      ariaTags={{
        'aria-label': `${openCC ? 'Open' : 'Close'} Closed Caption`,
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
  ['openCC'],
  []
)