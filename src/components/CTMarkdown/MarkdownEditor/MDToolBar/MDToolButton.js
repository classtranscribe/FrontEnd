import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { Popup } from 'semantic-ui-react';

function MDToolButton({
  popup = "",
  children,
  icon,
  color = "transparent",
  onClick,
}) {
  return (
    <Popup 
      inverted
      basic
      openOnTriggerMouseEnter
      openOnTriggerFocus
      openOnTriggerClick={false}
      closeOnTriggerBlur
      // position="top center"
      content={popup}
      trigger={
        <div>
          <Button
            compact
            classNames="ml-2"
            icon={icon}
            color={color}
            onClick={onClick}
            aria-label={popup}
          >
            {children}
          </Button>
        </div>
      }
    />
  );
}

MDToolButton.propTypes = {
  popup: PropTypes.string,
  children: PropTypes.node,
  icon: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
};

export default MDToolButton;
