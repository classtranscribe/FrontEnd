import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function ShareButton(props) {
  let { onClick } = props;
  return (
    <ActionButton
      icon="share"
      label="Share"
      onClick={onClick}
      labelPlacement="bottom"
    />
  );
}

ShareButton.propTypes = {

};

export default ShareButton;

