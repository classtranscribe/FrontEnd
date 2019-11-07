import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { videoControl } from '../../../Utils'

export function FullscreenButtonWithRedux({
  isFullscreen=false
}) {

  const handleFullscreen = () => {
    if (isFullscreen) {
      videoControl.exitFullScreen()
    } else {
      videoControl.enterFullScreen()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleFullscreen}
      label={ isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen" }
    >
      <span className="watch-btn-content" tabIndex="-1">
        {
          isFullscreen ?
          <i className="material-icons">fullscreen_exit</i>
          :
          <i className="material-icons">fullscreen</i>
        }    
      </span>
    </WatchCtrlButton>
  )
}

export const FullscreenButton = connectWithRedux(
  FullscreenButtonWithRedux,
  ['isFullscreen'],
  []
)