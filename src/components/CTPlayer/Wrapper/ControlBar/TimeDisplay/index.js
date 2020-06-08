import React from 'react';
import PropTypes from 'prop-types';
import { parseSec } from 'screens/Watch/Utils/helpers';
import './index.scss';

function TimeDisplay(props) {
  let {
    duration,
    time,
  } = props;

  return (
    <div className="ctp time-display">
      <span>{parseSec(time)}</span>
      <span className="time-separator">/</span>
      <span>{parseSec(duration)}</span>
    </div>
  );
}

TimeDisplay.propTypes = {

};

export default TimeDisplay;

