import React from 'react';
import PropTypes from 'prop-types';
import RangePlayButton from './RangePlayButton';

export function RangeContolBar(props) {
  let {
    range,
    openRange,
    onRangeChange,
    onPlayRange
  } = props;

  return openRange ? (
    <div className="ctp range">
      <div className="ctp range-ctrl-h">Time Range Controls</div>

      <div className="ctp range-ctrl">
        <RangePlayButton onClick={onPlayRange} />
      </div>
    </div>
  ) : null;
}

RangeContolBar.propTypes = {

};

