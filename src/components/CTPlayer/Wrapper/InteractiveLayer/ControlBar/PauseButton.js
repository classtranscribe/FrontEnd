import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function PauseButton(props) {
  let { onClick } = props;
  return (
    <ActionButton
      icon="pause"
      label="Pause"
      onClick={onClick}
    />
  );
}

PauseButton.propTypes = {

};

export default PauseButton;

