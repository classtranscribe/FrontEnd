import React, { useRef, useEffect } from 'react'
import { 
  connectWithRedux,
  videoControl,
  parseSec
} from '../../../Utils'
import './index.scss'

var isDragging = false

const displayTime = (e, duration) => {
  const seekingBar = document.getElementById('seeking')
    const totalWidth = seekingBar.clientWidth
    
    const seekingToBar = document.getElementById('seeking-to')
    seekingToBar.style.width = (((e.clientX - 11) / totalWidth)*100) + "%"

    const seekingTimeDisplay = document.getElementById('seeking-time')
    seekingTimeDisplay.style.opacity = 1
    seekingTimeDisplay.innerHTML = parseSec(Math.floor(((e.clientX - 11) / totalWidth) * duration))
    seekingTimeDisplay.style.marginLeft = (((e.clientX - 11 - seekingTimeDisplay.clientWidth / 2) / totalWidth) * 100) + "%"
}

const moveProgressBar = e => {
  const seekingBar = document.getElementById('seeking')
  const totalWidth = seekingBar.clientWidth
  document.getElementById('progress-amount').style.width = (((e.clientX - 11) / totalWidth)*100) + "%"
}

function ProgressBar({
  time=0,
  duration=0,
}) {
  var progressRef = useRef(null)

  const handleSeek = (e, settime=true) => {
    const seekingBar = document.getElementById('seeking')
    const totalWidth = seekingBar.clientWidth
    const seekTo = Math.floor(((e.clientX - 11) / totalWidth) * videoControl.duration)
    if (settime) {
      videoControl.currTime(seekTo)
    }
  }

  const handleMouseDown = e => {
    handleSeek(e)
  }

  const handleDragStart = e => {
    isDragging = true
  }

  const handleDrag = e => {
    moveProgressBar(e)
    displayTime(e, duration)
  }

  const handleDragEnd = e => {
    isDragging = false
    handleSeek(e)
  }

  const handleMouseMove = e => {
    // display the seeking time box
    displayTime(e, duration)
  }

  const handleMouseLeave = e => {
    // hide the seeking time box
    document.getElementById('seeking-to').style.width = 0
    document.getElementById('seeking-time').style.opacity = 0
  }

  useEffect(() => {
    if (!isDragging) {
      document.getElementById('progress-amount').style.width = (
        Boolean(progressRef.current) 
        ? Math.floor((time / duration) * progressRef.current.offsetWidth) 
        : 0
      ) + 'px'
    }
  }, [time])

  return (
    <div className="watch-progress-bar-container">
      <div 
        ref={progressRef} 
        className="watch-progress-bar" 
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >

        <div id="seeking-time" />

        <div className="buffered">
          <span id="buffered-amount" />
        </div>

        <div className="progress">
          <span id="progress-amount" />
          <span className="end-circle" />
          <span draggable
            className="end-circle-ghost"
            onDragStart={handleDragStart}
            onDrag={handleDrag}
            onDragEnd={handleDragEnd}
          />
        </div>

        <div className="seeking" id="seeking">
          <span id="seeking-to" />
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