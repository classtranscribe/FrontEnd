import React from 'react';
import PropTypes from 'prop-types';
import RangeSlider from './RangeSlider';
import RangeControlBar from './RangeControlBar';
import './index.scss';

function Range(props) {
  const {
    id,
    duration,
    time,
    range,
    onRangeChange,
    onPlayRange
  } = props;

  const sliderProps = {
    id,
    duration,
    range,
    onRangeChange,
  };

  const controlProps = {
    id,
    duration,
    range,
    time,
    onPlayRange,
    onRangeChange
  };

  return (
    <div className="ctp range">
      <h5>TIME RANGE PICKER</h5>

      <RangeSlider {...sliderProps} />
      <RangeControlBar {...controlProps} />
    </div>
  );
}

Range.propTypes = {
  id: PropTypes.string,
  time: PropTypes.number,
  duration: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.number),
  onRangeChange: PropTypes.func,
  onPlayRange: PropTypes.func
};

export default Range;

