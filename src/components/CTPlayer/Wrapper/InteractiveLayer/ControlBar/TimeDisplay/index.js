import React from 'react';
import PropTypes from 'prop-types';
import timestr from 'utils/time-string';
import './index.scss';

function TimeDisplay(props) {
  let {
    duration,
    time,
  } = props;

  return (
    <div className="ctp time-display">
      <span>{timestr.toTimeString(time)}</span>
      <span className="time-separator">/</span>
      <span>{timestr.toTimeString(duration)}</span>
    </div>
  );
}

TimeDisplay.propTypes = {
  duration: PropTypes.number,
  time: PropTypes.number
};

export default TimeDisplay;

