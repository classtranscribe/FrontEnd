import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function ExitFullScreenButton(props) {
  let { onClick } = props;
  
  return (
    <ActionButton
      icon="fullscreen_exit"
      label="Exit Fullscreen"
      onClick={onClick}
    />
  );
}

ExitFullScreenButton.propTypes = {
  onClick: PropTypes.func
};

export default ExitFullScreenButton;

