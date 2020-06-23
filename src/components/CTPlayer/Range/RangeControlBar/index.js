import React from 'react';
import PropTypes from 'prop-types';
import TimeDisplay from '../../Wrapper/InteractiveLayer/ControlBar/TimeDisplay';
import RangePlayButton from './RangePlayButton';
import RangeInput from './RangeInput';
import './index.scss';

function RangeContolBar(props) {
  let {
    id,
    duration,
    time,
    range,
    onRangeChange,
    onPlayRange
  } = props;

  const inputProps = {
    id: `input-${ id}`,
    duration,
    range,
    onRangeChange,
  };

  return (
    <div className="ctp range-ctrl ct-d-r-center-v">
      <RangePlayButton onClick={onPlayRange} />
      <TimeDisplay time={time} duration={duration} />
      <RangeInput {...inputProps} />
    </div>
  );
}

RangeContolBar.propTypes = {
  id: PropTypes.string,
  duration: PropTypes.number,
  time: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.number),
  onRangeChange: PropTypes.func,
  onPlayRange: PropTypes.func
};

export default RangeContolBar;

