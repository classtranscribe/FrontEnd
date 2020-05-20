import React from 'react';
import { connectWithRedux, parseSec } from '../../../Utils';
import './index.css';

function TimeDisplay({ time = 0, duration = 0 }) {
  const displayedTime = parseSec(time);
  const displayedDuration = parseSec(duration);

  return (
    <div className="watch-time-display">
      <span className="td-played-time">{displayedTime}</span>
      <span className="td-time-separator">/</span>
      <span className="td-duration">{displayedDuration}</span>
    </div>
  );
}

export default connectWithRedux(TimeDisplay, ['time', 'duration']);
