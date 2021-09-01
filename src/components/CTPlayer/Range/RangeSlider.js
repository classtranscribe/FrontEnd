import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import timestr from 'utils/use-time';

import RangeTimeLabel from './RangeTimeLabel';

function RangeSlider(props) {
  let {
    range,
    duration,
    onRangeChange
  } = props;

  const handleRangeChange = (e, newRange) => {
    if (typeof onRangeChange === 'function') {
      onRangeChange(newRange);
    }
  }

  
  let max = duration;
  let min = 0;
  if (Array.isArray(range)) {
    min = range[0]
    max = range[1]
    let pad = max - min;
    pad = pad < 5 ? 5 : pad;
    min = range[0] - pad < 0 ? 0 : range[0] - pad;
    max = range[1] + pad > duration ? duration : range[1] + pad;
  }

  const rangeSliderProps = {
    className: 'ctp range-slider',
    min,
    max,
    step: 0.001,
    value: range,
    onChange: handleRangeChange,
    valueLabelFormat: timestr.toDecimalTimeString,
    valueLabelDisplay: 'on',
    ValueLabelComponent: RangeTimeLabel,
    getAriaLabel: () => 'Range Slider',
    // marks: _.map(range, rg => ({ value: rg, label: timestr.toTimeString(rg) }))
  };

  return (
    <div className="ctp range-slider-con">
      <Slider {...rangeSliderProps} />
    </div>
  );
}

RangeSlider.propTypes = {
  range: PropTypes.arrayOf(PropTypes.number),
  duration: PropTypes.number,
  onRangeChange: PropTypes.func
};

export default RangeSlider;