import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function PlayButton(props) {
  let { onClick } = props;
  return (
    <ActionButton
      icon="play_arrow"
      label="Play"
      onClick={onClick}
    />
  );
}

PlayButton.propTypes = {

};

export default PlayButton;
