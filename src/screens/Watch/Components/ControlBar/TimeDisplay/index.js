import { connect } from 'dva';
import React from 'react';
import { connectWithRedux, parseSec } from '../../../Utils';
import './index.scss';

// var videoTimestamp = ''; // May 20 Jiaxi

function TimeDisplay({ time = 0, duration = 0, liveMode = false }) {
  const displayedTime = parseSec(time);
  const displayedDuration = parseSec(duration);

  // videoTimestamp = displayedTime; // May 20 Jiaxi

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

// export {videoTimestamp}; // May 20 Jiaxi
