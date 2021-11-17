import React from 'react';
import PropTypes from 'prop-types';
import timestr from 'utils/use-time';

function SeekTimeLabel(props) {
  const { width, left, duration, reverse = false } = props;
  // left += 10;
  const sec = Math.round(((reverse ? (width - left) : left) / width) * duration);
  const shouldDisplay = sec <= duration && width > 100 && left >= 0;

  let styleLeft = left;
  if (left < 30) {
    styleLeft = 30;
  } else if (left > width - 30) {
    styleLeft = width - 30;
  }

  return shouldDisplay ? (
    <div
      className="ctp seek-time-prompt ct-d-c-center"
      style={{ left: `${styleLeft}px` }}
    >
      {(reverse ? '-' : '') + timestr.toTimeString(sec)}
    </div>
  ) : null;
}

SeekTimeLabel.propTypes = {
  width: PropTypes.number,
  left: PropTypes.number,
  duration: PropTypes.number
};

export default SeekTimeLabel;

