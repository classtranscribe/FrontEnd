import React from 'react'
import { connectWithRedux } from '../../../../../_redux/watch'
import './index.css'
import { 
  videoControl, 
  CTP_LOADING, 
  CTP_ENDED
} from '../../../Utils'

function BigPlayButtonWithRedux({
  paused=true,
  ctpPriEvent=CTP_LOADING,
  isPrimary=false,
}) {
  
  const handleClick = () => {
    if (ctpPriEvent === CTP_ENDED) {
      videoControl.replay()
    }
    // videoControl.handlePause()
  }

  return isPrimary ? (
    <div 
      className="wbp-btn-container"
      paused={paused.toString()}
    >
      {
        ctpPriEvent === CTP_ENDED ?
          <button 
            className="wbp-btn plain-btn"
            onClick={handleClick} 
            aria-label="Replay"
          >
            <span className="big-play-button-content" tabIndex="-1">
              <i className="material-icons">replay</i>
            </span>
          </button>
        :
        ctpPriEvent === CTP_LOADING ?
          <div>
            <div className="sk-chase" color="green">
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
              <div className="sk-chase-dot"></div>
            </div>
          </div>
        :
        paused ? 
          <button 
            className="wbp-btn plain-btn"
            onClick={handleClick} 
            aria-label={paused ? 'Play' : 'Pause'}
          >
            <span className="big-play-button-content" tabIndex="-1">
              <i className="material-icons">play_arrow</i>
            </span>
          </button>
        : null
      }
    </div>
  ) : null
}

export const BigPlayButton = connectWithRedux(
  BigPlayButtonWithRedux,
  ['paused' , 'ctpPriEvent'],
  []
)
