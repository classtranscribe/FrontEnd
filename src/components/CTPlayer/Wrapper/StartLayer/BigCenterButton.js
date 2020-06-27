import React from 'react';
import PropTypes from 'prop-types';

function BigCenterButton(props) {
  let {
    icon,
    label,
    onClick
  } = props;

  return (
    <button 
      className="plain-btn ctp big-center-btn" 
      onClick={onClick} 
      aria-hidden={label ? "false" : "true"}
      aria-label={label}
    >
      <span tabIndex="-1">
        <i className="material-icons">{icon}</i>
      </span>
    </button>
  );
}

BigCenterButton.propTypes = {
  /** The name of a material-icon */
  icon: PropTypes.string,

  /** The label for the icon */
  label: PropTypes.string,

  /** The click action */
  onClick: PropTypes.func
};

export default BigCenterButton;
