import React from 'react';
import PropTypes from 'prop-types';
import Slider from '@material-ui/core/Slider';
import { parseSec } from 'screens/Watch/Utils/helpers';

import RangeTimeLabel from './RangeTimeLabel';

export function RangeSlider(props) {
  let {
    openRange,
    range,
    duration,
    onRangeChange
  } = props;

  const handleRangeChange = (e, newRange) => {
    if (typeof onRangeChange === 'function') {
      onRangeChange(newRange);
    }
  }

  const displayLabel = range && range[1] - range[0] < 180;

  const rangeSliderProps = {
    className: 'ctp range-slider',
    min: 0,
    max: duration,
    step: 0.001,
    value: range,
    onChange: handleRangeChange,
    valueLabelFormat: parseSec,
    valueLabelDisplay: displayLabel ? 'on' : 'off',
    ValueLabelComponent: RangeTimeLabel
  };

  return openRange ? (
    <div className="ctp range">
      <Slider {...rangeSliderProps} />
    </div>
  ) : null;
}

RangeSlider.propTypes = {
  openRange: PropTypes.bool,
  range: PropTypes.arrayOf(PropTypes.number),
  duration: PropTypes.number,
  onRangeChange: PropTypes.func
};