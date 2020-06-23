import React from 'react';
import PropTypes from 'prop-types';
import SliderTimeLabel from '../Wrapper/InteractiveLayer/ControlBar/Progress/SliderTimeLabel';

function RangeTimeLabel(props) {
  const { index } = props;
  const placement = index === 0 ? 'left' : 'right';
  return (
    <SliderTimeLabel {...props} placement={placement} />
  );
}

RangeTimeLabel.propTypes = {
  index: PropTypes.number
};

export default RangeTimeLabel;

