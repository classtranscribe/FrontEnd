import React, { useRef, useEffect } from 'react'
import { connectWithRedux } from '../../../Utils'
import { prog } from './progress-controller'
import './index.scss'

function ProgressBar({
  time=0,
  duration=0,
}) {
  var progressRef = useRef(null)

  const handleMouseDown = e => prog.handleMouseDown(e)
  const handleMouseMove = e => prog.handleMouseMove(e, duration)
  const handleMouseLeave = e => prog.handleMouseLeave(e)

  const handleDragStart = e => prog.handleDragStart(e)
  const handleDrag = e => prog.handleDrag(e, duration)
  const handleDragEnd = e => prog.handleDragEnd(e)

  useEffect(() => {
    prog.updateTime(time, duration)
  }, [time])

  useEffect(() => {
    prog.reset()
  }, [duration])

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