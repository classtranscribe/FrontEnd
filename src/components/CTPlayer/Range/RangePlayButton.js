import React from 'react';
import PropTypes from 'prop-types';

function RangePlayButton(props) {
  const {
    onClick,
  } = props;

  return (
    <button className="plain-btn ctp range-play-btn" onClick={onClick}>
      <span tabIndex="-1">
        <i className="material-icons">play_arrow</i>
        Play Time Range
      </span>
    </button>
  );
}

RangePlayButton.propTypes = {
  onClick: PropTypes.func
};

export default RangePlayButton;

