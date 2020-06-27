import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function SwapScreenButton(props) {
  const { onClick } = props;

  return (
    <ActionButton
      icon="compare_arrows"
      label="Swap Screens"
      onClick={onClick}
    />
  );
}

SwapScreenButton.propTypes = {
  onClick: PropTypes.func
};

export default SwapScreenButton;

