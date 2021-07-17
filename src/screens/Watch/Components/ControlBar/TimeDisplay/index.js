import { connect } from 'dva';
import React from 'react';
import { connectWithRedux, parseSec } from '../../../Utils';
import './index.scss';

function TimeDisplay({ time = 0, duration = 0, liveMode = false }) {
  const displayedTime = parseSec(time);
  const displayedDuration = parseSec(duration);

  return (
    <div className="watch-time-display">
      {
        liveMode ? <>Live - {liveMode}</> :
        <>
          <span className="td-played-time">{displayedTime}</span>
          <span className="td-time-separator">/</span>
          <span className="td-duration">{displayedDuration}</span>
        </>
      }

    </div>
  );
}

export default connect(({ watch: { time, duration, liveMode } }) => ({
  time, duration, liveMode
}))(TimeDisplay);
