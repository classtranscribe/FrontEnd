import React from 'react';
import PropTypes from 'prop-types';
import ActionButton from '../ActionButton';

function SettingsButton(props) {
  let { onClick, active = false } = props;

  return (
    <ActionButton
      icon={<i className="fas fa-cog" />}
      label="Settings"
      active={active}
      onClick={onClick}
      aria-haspopup="true"
    />
  );
}

SettingsButton.propTypes = {
  onClick: PropTypes.func,
  active: PropTypes.bool
};

export default SettingsButton;

