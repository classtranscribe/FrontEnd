import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
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
      label={<>Closed Caption: <strong>{openCC ? 'ON' : 'OFF'}</strong></>}
      ariaLabel={`${openCC ? 'Open' : 'Close'} Closed Caption`}
      id="closed-caption-btn"
      colored={openCC}
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">closed_caption</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const ClosedCaptionButton = connectWithRedux(
  ClosedCaptionButtonWithRedux,
  ['openCC'],
  []
)