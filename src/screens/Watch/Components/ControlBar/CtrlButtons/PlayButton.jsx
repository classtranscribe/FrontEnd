import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { videoControl } from '../../../Utils'

export function PlayButtonWithRedux({
  paused=true,
}) {

  const handlePause = () => {
    if (paused) {
      videoControl.play()
    } else {
      videoControl.pause()
    }
  }

  return (
    <button 
      className="watch-ctrl-button" 
      onClick={handlePause}
      aria-label="Play"
    >
      <span className="watch-btn-content" tabIndex="-1">
        {
          paused ?
          <i className="material-icons">play_arrow</i>
          :
          <i className="material-icons">pause</i>
        }        
      </span>
    </button>
  )
}

export const PlayButton = connectWithRedux(
  PlayButtonWithRedux,
  ['paused'],
  []
)