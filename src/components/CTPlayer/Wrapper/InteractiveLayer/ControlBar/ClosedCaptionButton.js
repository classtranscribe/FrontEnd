import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function ClosedCaptionButton(props) {
  let { onClick, openCC } = props;

  const label = `${openCC ? 'Close' : 'Open'} Closed Caption`;
  const iconElement = <i className="fas fa-closed-captioning" />;

  return (
    <ActionButton
      icon={iconElement}
      label={label}
      onClick={onClick}
      highlighted={openCC}
    />
  );
}

ClosedCaptionButton.propTypes = {
  openCC: PropTypes.bool,
  onClick: PropTypes.func
};

export default ClosedCaptionButton;
