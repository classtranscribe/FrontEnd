import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../../Wrapper/InteractiveLayer/ActionButton';

function RangePlayButton(props) {
  const {
    onClick,
  } = props;

  return (
    <ActionButton
      icon="play_arrow"
      label="Play the Range"
      onClick={onClick}
      color="teal"
    />
  );
}

RangePlayButton.propTypes = {
  onClick: PropTypes.func
};

export default RangePlayButton;

