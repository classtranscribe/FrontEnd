import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { connect } from 'dva'
import { prog } from '../../../Utils/progress-controllers';
import './index.scss';

function ProgressBar(props) {
  const { dispatch, watch } = props;
  const { time = 0, duration = 0, bufferedTime = 0, embedded } = watch;
  prog.setModel(dispatch, watch)
  const handleClick = (e) => prog.handleClick(e);

  const handleMouseDown = (e) => prog.handleMouseDown(e);
  const handleMouseMove = (e) => prog.handleMouseMove(e, duration);
  const handleMouseLeave = (e) => prog.handleMouseLeave(e);
  const handleMouseUp = (e) => prog.handleMouseUp(e);

  const handleDragStart = (e) => prog.handleDragStart(e);
  const handleDrag = (e) => prog.handleDrag(e, duration);
  const handleDragEnd = (e) => prog.handleDragEnd(e);

  const handleTouchStart = (e) => prog.handleTouchStart(e);
  const handleTouchMove = (e) => prog.handleTouchMove(e);
  const handleTouchEnd = (e) => prog.handleTouchEnd(e);

  useEffect(() => {
    prog.updateTime(time, duration);
  }, [time]);

  useEffect(() => {
    prog.reset();
  }, [duration]);

  return (
    <div className="watch-progress-bar-container" data-mobile={isMobile}>
      <div
        className="watch-progress-bar"
        onClick={handleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        // Mobile events
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div id="seeking-time" />

        <div className="buffered">
          <span id="buffered-amount" style={{ width: bufferedTime }} />
        </div>

        <div className="progress">
          <span id="progress-amount" />
          <span className="end-circle" />
          <span
            draggable={prog.draggable}
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
  );
}

export default connect(({ watch, loading }) => ({
  watch
}))(ProgressBar);
