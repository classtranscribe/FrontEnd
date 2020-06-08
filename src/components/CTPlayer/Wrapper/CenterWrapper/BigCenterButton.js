import React from 'react';
import PropTypes from 'prop-types';
import './index.scss';

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
      aria-hidden="true"
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
