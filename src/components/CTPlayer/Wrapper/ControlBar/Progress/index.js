import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import { parseSec } from 'screens/Watch/Utils/helpers';
import './index.scss';

import SliderTimeLabel from './SliderTimeLabel';

function Progress(props) {
  let {
    duration,
    time,
    bufferedTime,
    setCurrentTime,
    openRange,
    range,
  } = props;

  const [mouseLeft, setMouseLeft] = useState(-1);
  const handleMouseLeave = () => {
    setMouseLeft(-1);
  };

  const handleMouseMove = (e) => {
    let offsetX = e.nativeEvent.offsetX;
    // console.log(offsetX);
    if (offsetX >= 0) {
      setMouseLeft(offsetX);
    } else {
      setMouseLeft(-1);
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
    valueLabelFormat: parseSec,
    ValueLabelComponent: SliderTimeLabel
  };

  return (
    <div 
      className="ctp progress-con"
    >
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

};

export default Progress;

