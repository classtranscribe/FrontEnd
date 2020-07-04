import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import timestr from 'utils/use-time';

function RangeInput(props) {
  const {
    id,
    duration,
    range,
    onRangeChange
  } = props;

  const min = timestr.toDecimalTimeString(0);
  const max = timestr.toDecimalTimeString(duration);

  const [time1, setTime1] = useState('00:00:00.00');
  const [time2, setTime2] = useState('00:00:00.00');
  const [wasInputChange, setWasInputChange] = useState(false);

  useEffect(() => {
    if (Array.isArray(range) && !wasInputChange) {
      setTime1(timestr.toDecimalTimeString(range[0]));
      setTime2(timestr.toDecimalTimeString(range[1]));
    }

    if (wasInputChange) {
      setWasInputChange(false);
    }
  }, [range]);

  const onTime1Change = ({ target: { value }}) => {
    setWasInputChange(true);
    setTime1(value);
    if (typeof onRangeChange === 'function') {
      onRangeChange([timestr.toSeconds(value), range[1]]);
    }
  };

  const onTime2Change = ({ target: { value }}) => {
    setWasInputChange(true);
    setTime2(value);
    if (typeof onRangeChange === 'function') {
      onRangeChange([range[0], timestr.toSeconds(value)]);
    }
  };

  const time1Props = {
    id: `time1-${ id}`,
    type: 'time',
    min,
    max: time2,
    step: '0.01',
    value: time1,
    onChange: onTime1Change,
    'aria-label': 'Begin time of the range'
  };

  const time2Props = {
    id: `time2-${ id}`,
    type: 'time',
    min: time1,
    max,
    step: '0.01',
    value: time2,
    onChange: onTime2Change,
    'aria-label': 'End time of the range'
  };

  return (
    <div className="ctp range-input-con ct-d-r-center-v">
      <input {...time1Props} />

      <span className="ct-d-c-center" aria-hidden="true">
        <i className="material-icons">arrow_right_alt</i>
      </span>

      <input {...time2Props} />
    </div>
  );
}

RangeInput.propTypes = {
  id: PropTypes.string,
  duration: PropTypes.number,
  range: PropTypes.arrayOf(PropTypes.number),
  onRangeChange: PropTypes.func,
};

export default RangeInput;

