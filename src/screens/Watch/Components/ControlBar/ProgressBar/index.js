import React, { useRef } from 'react'
import { 
  connectWithRedux,
  videoControl,
  parseSec
} from '../../../Utils'
import './index.scss'

function ProgressBar({
  time=0,
  duration=0,
}) {
  var progressRef = useRef(null)

  const handleOnMouseMove = e => {
    const seekingBar = document.getElementById('seeking')
    const totalWidth = seekingBar.clientWidth
    
    const seekingToBar = document.getElementById('seeking-to')
    seekingToBar.style.width = (((e.clientX - 11) / totalWidth)*100) + "%"

    const seekingTimeDisplay = document.getElementById('seeking-time')
    seekingTimeDisplay.style.opacity = 1
    seekingTimeDisplay.innerHTML = parseSec(Math.floor(((e.clientX - 11) / totalWidth) * duration))
    seekingTimeDisplay.style.marginLeft = (((e.clientX - 11 - seekingTimeDisplay.clientWidth / 2) / totalWidth) * 100) + "%"
  }

  const handleOnMouseLeave = e => {
    document.getElementById('seeking-to').style.width = 0
    document.getElementById('seeking-time').style.opacity = 0
  }

  const handleOnClick = e => {
    const seekingBar = document.getElementById('seeking')
    const totalWidth = seekingBar.clientWidth
    const seekTo = Math.floor(((e.clientX - 11) / totalWidth) * videoControl.duration)
    videoControl.currTime(seekTo)
  }

  return (
    <div className="watch-progress-bar-container">
      <div 
        ref={progressRef} 
        className="watch-progress-bar" 
        // onMouseMove={handleOnMouseMove}
        // onMouseLeave={handleOnMouseLeave}
        onClick={handleOnClick}
      >

        <div id="seeking-time">

        </div>
        <div className="buffered">
          <span id="buffered-amount"></span>
        </div>
        <div className="progress">
          <span 
            id="progress-amount"
            style={{
              width: (Boolean(progressRef.current) ? Math.floor((time / duration) * progressRef.current.offsetWidth) : 0) || 0
            }}
          />
          <span className="end-circle" />
        </div>
        <div className="seeking" id="seeking">
          <span id="seeking-to"></span>
        </div>
      </div>
    </div>
  )
}

export default connectWithRedux(
  ProgressBar,
  ['time', 'duration'],
  []
)