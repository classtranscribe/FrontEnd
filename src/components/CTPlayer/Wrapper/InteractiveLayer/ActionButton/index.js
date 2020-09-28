import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import './index.scss';

export const useStyles = makeStyles({
  tooltip: {
    backgroundColor: '#363636',
    fontSize: '13px'
  },
  arrow: {
    color: '#363636'
  }
});

function ActionButton(props) {
  let {
    label,
    labelPlacement = 'top',
    labelEnterDelay,
    icon,
    active,
    highlighted,
    onClick,
    classNames,
    disabled,
    ...ariaProps
  } = props;

  const labelClasses = useStyles();

  const actBtnClasses = cx('ctp', 'act-btn', classNames, {
    active,
    highlighted,
  });

  const iconElement = typeof icon === 'string'
                    ? <i className="material-icons">{icon}</i>
                    : icon;

  return (
    <Tooltip
      classes={labelClasses}
      title={label} 
      placement={labelPlacement} 
      enterDelay={labelEnterDelay}
      disableHoverListener={disabled}
    >
      <button 
        aria-label={label} 
        className={actBtnClasses} 
        onClick={onClick}
        disabled={disabled}
        {...ariaProps}
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
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  active: PropTypes.bool,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func,
  playButton: PropTypes.bool
};

export default ActionButton;

