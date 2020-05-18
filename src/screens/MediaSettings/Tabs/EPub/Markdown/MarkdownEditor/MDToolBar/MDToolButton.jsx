import React from 'react';
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
          <Button compact
            classNames="ml-2"
            icon={icon}
            color={color}
            onClick={onClick}
          >
            {children}
          </Button>
        </div>
      }
    />
  );
}

export default MDToolButton;
