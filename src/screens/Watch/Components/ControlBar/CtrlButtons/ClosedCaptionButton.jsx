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
      label={<>Closed Caption (c)</>}
      id="closed-caption-btn"
      colored={openCC}
      ariaTags={{
        'aria-label': `${openCC ? 'Open' : 'Close'} Closed Caption`,
        //'aria-keyshortcuts': 'c',
        'aria-controls': 'watch-cc-container'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
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