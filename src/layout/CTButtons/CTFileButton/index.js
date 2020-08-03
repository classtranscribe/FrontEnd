import React from 'react';
import PropTypes from 'prop-types';
import ButtonBase from '@material-ui/core/ButtonBase';
import './index.scss';

function FileButton(props) {
  const {
    children,
    icon,
    description,
    onClick,
    disabled,
    ...otherProps
  } = props;

  const iconElement = typeof icon === 'string' 
                    ? <span className="material-icons">{icon}</span>
                    : icon;

  return (
    <ButtonBase
      focusRipple
      className="ct-file-btn"
      disabled={disabled}
      onClick={onClick}
      {...otherProps}
    >
      <div className="ct-file-btn-content" tabIndex="-1">
        <div className="ct-file-btn-icon file">
          {iconElement}
        </div>
        <div className="ct-file-btn-icon download">
          <i className="fas fa-file-download" />
        </div>
        <div className="ct-file-btn-name">
          <span className="name">{children}</span>
          <span className="description">{description}</span>
        </div>
      </div>
    </ButtonBase>
  );
}

FileButton.propTypes = {
  children: PropTypes.node,
  icon: PropTypes.node,
  description: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool
};

export default FileButton;

