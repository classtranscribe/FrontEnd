import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'dva'
import Slider from '@material-ui/core/Slider';
import timestr from 'utils/use-time';
import './index.scss';

import SeekTimeLabel from './SeekTimeLabel';
import SliderTimeLabel from './SliderTimeLabel';

function Progress(props) {
  let {
    beginAt,
    endAt,
    duration,
    time,
    bufferedTime,
    dispatch
  } = props;

  const marks = (beginAt || endAt) ? [{ value: beginAt }, { value: endAt }] : undefined;

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
    dispatch({ type: 'watch/media_setCurrTime', payload: newTime });
  };

  const bufferSliderProps = {
    className: 'ctp buffer-slider',
    min: 0,
    max: duration,
    step: 0.01,
    value: bufferedTime,
    'aria-hidden': 'true'
  };

  const timeSliderProps = {
    className: 'ctp time-slider',
    min: 0,
    max: duration,
    step: 0.001,
    value: time,
    marks,
    onChange: handleSeekTime,
    valueLabelFormat: timestr.toTimeString,
    ValueLabelComponent: SliderTimeLabel,
    'aria-label': 'Time Slider'
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


export default connect(({ watch : {bufferedTime, time, duration} }) => ({
  bufferedTime, time, duration
}))(Progress);

