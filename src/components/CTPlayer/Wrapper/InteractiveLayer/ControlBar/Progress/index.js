import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import timestr from 'utils/time-string';
import './index.scss';

import SeekTimeLabel from './SeekTimeLabel';
import SliderTimeLabel from './SliderTimeLabel';

function Progress(props) {
  let {
    duration,
    time,
    bufferedTime,
    setCurrentTime,
  } = props;

  const [mousePos, setMousePos] = useState([-1, -1]);
  const handleMouseLeave = () => {
    setMousePos([-1, -1]);
  };

  const handleMouseMove = (e) => {
    let { offsetX } = e.nativeEvent;
    let { width } = e.target.getBoundingClientRect();
    if (offsetX >= 0) {
      setMousePos([width, offsetX]);
    } else {
      setMousePos([width, -1]);
    }
  };

  const handleSeekTime = (e, newTime) => {
    if (typeof setCurrentTime === 'function') {
      setCurrentTime(newTime);
    }
  };

  const bufferSliderProps = {
    className: 'ctp buffer-slider',
    min: 0,
    max: duration,
    step: 0.01,
    value: bufferedTime,
  };

  const timeSliderProps = {
    className: 'ctp time-slider',
    min: 0,
    max: duration,
    step: 0.001,
    value: time,
    // marks,
    onChange: handleSeekTime,
    valueLabelFormat: timestr.toTimeString,
    ValueLabelComponent: SliderTimeLabel
  };

  return (
    <div 
      className="ctp progress-con"
    >
      <SeekTimeLabel
        width={mousePos[0]}
        left={mousePos[1]}
        duration={duration}
      />

      <div 
        className="ctp time-slider-con"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Slider {...bufferSliderProps} />
        <Slider {...timeSliderProps} />
      </div>
    </div>
  );
}

Progress.propTypes = {
  duration: PropTypes.number,
  time: PropTypes.number,
  bufferedTime: PropTypes.number,
  setCurrentTime: PropTypes.func,
};

export default Progress;

