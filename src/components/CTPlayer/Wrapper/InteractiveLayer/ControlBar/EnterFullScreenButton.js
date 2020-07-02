import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function EnterFullScreenButton(props) {
  let { onClick } = props;
  
  return (
    <ActionButton
      icon="fullscreen"
      label="Enter Fullscreen"
      onClick={onClick}
    />
  );
}

EnterFullScreenButton.propTypes = {
  onClick: PropTypes.func
};

export default EnterFullScreenButton;

