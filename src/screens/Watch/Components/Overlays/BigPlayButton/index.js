import React from 'react'
import { connectWithRedux } from '_redux/watch'
import './index.css'
import { videoControl } from '../../../Utils'

function BigPlayButtonWithRedux({
  paused=true,
  isPrimary=false,
}) {
  
  const handleClick = () => {
    // videoControl.handlePause()
  }

  return (paused && isPrimary) ? (
    <div 
      className="watch-big-play-button-container"
      paused={paused.toString()}
    >
      <button 
        className="watch-big-play-button plain-btn"
        onClick={handleClick} 
        aria-label={paused ? 'Play' : 'Pause'}
      >
        <span className="big-play-button-content" tabIndex="-1">
          <i className="material-icons">play_arrow</i>
        </span>
      </button>
    </div>
  ) : null
}

export const BigPlayButton = connectWithRedux(
  BigPlayButtonWithRedux,
  ['paused'],
  []
)
