import React from 'react'
import PropTypes from 'prop-types'
import SliderTimeLabel from '../Progress/SliderTimeLabel';

function RangeTimeLabel(props) {
  const { index } = props;
  const placement = index === 0 ? 'left' : 'right';
  return (
    <SliderTimeLabel {...props} placement={placement} />
  )
}

RangeTimeLabel.propTypes = {

}

export default RangeTimeLabel

