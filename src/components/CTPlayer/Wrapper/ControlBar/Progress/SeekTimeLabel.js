import React from 'react';
import PropTypes from 'prop-types';
import { parseSec } from 'screens/Watch/Utils/helpers';

function SeekTimeLabel(props) {
  const { width, left, duration } = props;
  // left += 10;
  const sec = Math.floor((left / width) * duration);
  const shouldDisplay = sec <= duration && width > 100 && left >= 0;

  return shouldDisplay ? (
    <div className="ctp seek-time-prompt ct-d-c-center" style={{ left: `${left }px` }}>
      {parseSec(sec)}
    </div>
  ) : null;
}

SeekTimeLabel.propTypes = {
  width: PropTypes.number,
  left: PropTypes.number,
  duration: PropTypes.number
};

export default SeekTimeLabel;

