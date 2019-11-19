import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { videoControl } from '../../../Utils'

export function PlayButtonWithRedux({
  paused=true,
}) {

  const handlePause = () => videoControl.handlePause()

  return (
    <WatchCtrlButton 
      onClick={handlePause}
      label={paused ? 'Play (k)' : 'Pause (k)'}
      ariaLabel={paused ? 'Play (k)' : 'Pause (k)'}
      mouseEnterDelay={600}
      id="play-btn"
    >
      <span className="watch-btn-content" tabIndex="-1">
        {
          paused ?
          <i className="material-icons">play_arrow</i>
          :
          <i className="material-icons">pause</i>
        }        
      </span>
    </WatchCtrlButton>
  )
}

export const PlayButton = connectWithRedux(
  PlayButtonWithRedux,
  ['paused'],
  []
)