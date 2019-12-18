import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../../WatchCtrlButton'
import { videoControl, CTP_LOADING, CTP_ENDED } from '../../../Utils'

export function PlayButtonWithRedux({
  paused=true,
  ctpPriEvent=CTP_LOADING,
}) {

  const ended = ctpPriEvent === CTP_ENDED
  const handlePause = () => {
    if (ended) {
      videoControl.replay()
    } else {
      videoControl.handlePause()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handlePause}
      label={paused ? 'Play (k)' : 'Pause (k)'}
      //mouseEnterDelay={600}
      id="play-btn"
      ariaTags={{
        'aria-label': ended ? 'Replay' : paused ? 'Play (k)' : 'Pause (k)',
        //'aria-keyshortcuts': 'k'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        {
          ended ?
          <i className="material-icons">replay</i>
          :
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
  ['paused', 'ctpPriEvent'],
  []
)