import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Tooltip from '@material-ui/core/Tooltip';
import './index.scss';

function ActionButton(props) {
  let {
    label,
    labelPlacement = 'top',
    labelEnterDelay,
    icon,
    active,
    highlighted,
    onClick,
  } = props;

  const actBtnClasses = cx('ctp', 'act-btn', {
    active,
    highlighted
  });

  const iconElement = typeof icon === 'string'
                    ? <i className="material-icons">{icon}</i>
                    : icon;

  return (
    <Tooltip 
      title={label} 
      placement={labelPlacement} 
      enterDelay={labelEnterDelay}
    >
      <button 
        aria-label={label} 
        className={actBtnClasses} 
        onClick={onClick}
      >
        <span tabIndex="-1">
          {iconElement}
        </span>
      </button>
    </Tooltip>
  );
}

ActionButton.propTypes = {
  label: PropTypes.string,
  labelPlacement: PropTypes.oneOf(['top', 'bottom']),
  icon: PropTypes.string,
  active: PropTypes.bool,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func,
};

export default ActionButton;

