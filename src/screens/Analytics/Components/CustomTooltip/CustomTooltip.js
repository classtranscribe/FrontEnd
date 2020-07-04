import React from 'react';
import './CustomTooltip.scss';

export default function CustomTooltip(props) {
  const { date, duration, videoName } = props.info;

  return (
    <div className="tooltip-box">
      <div className="text-box">
        <p>Date: {date}</p>
        <p>Duration: {duration} min</p>
        <p>Video: {videoName}</p>
      </div>
    </div>
  );
}
