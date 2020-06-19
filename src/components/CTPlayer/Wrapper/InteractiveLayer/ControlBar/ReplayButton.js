import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function ReplayButton(props) {
  let { onClick } = props;
  return (
    <ActionButton
      icon="replay"
      label="Replay"
      onClick={onClick}
    />
  );
}

ReplayButton.propTypes = {

};

export default ReplayButton;
