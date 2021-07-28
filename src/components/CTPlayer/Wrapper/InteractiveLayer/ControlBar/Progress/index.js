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
    liveMode,
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
      setMousePos([width, width]);
    }
  };

  const handleSeekTime = (e, newTime) => {
    dispatch({ type: 'watch/media_setCurrTime', payload: newTime });
  };

  const bufferSliderProps = {
    className: 'ctp buffer-slider',
    min: 0,
    max: duration,
    step: 0.001,
    value: bufferedTime,
    'aria-hidden': 'true'
  };

  const TSLP1 = liveMode ? {
    min: -duration,
    max: 0,
    step: .001,
  } : {
    min: 0,
    max: duration,
    step: 0.001,
  }
  const tslProp = (value) => {
    return (liveMode ? "-" : "" ) + timestr.toTimeString(value * (liveMode ? -1 : 1))
  }
  const timeSliderProps = {
    className: 'ctp time-slider',
    ...TSLP1,
    value: liveMode === 1 ? duration : liveMode === 2 ? -duration + time : time,
    marks,
    onChange: handleSeekTime,
    valueLabelFormat: tslProp,
    ValueLabelComponent: SliderTimeLabel,
    'aria-label': 'Time Slider'
  };

  return (
    <div
      className="ctp progress-con"
    >
      <SeekTimeLabel
        reverse={liveMode}
        width={mousePos[0]}
        left={mousePos[1]}
        duration={duration}
      />

      <div
        className="ctp time-slider-con"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <Slider {...timeSliderProps} />
      </div>
    </div>
  );
}


export default connect(({ watch: { bufferedTime, time, duration, liveMode } }) => ({
  bufferedTime, time, duration, liveMode
}))(Progress);

