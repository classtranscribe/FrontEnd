import React from 'react';
import { Button, Popup } from 'semantic-ui-react';

export function DismissButton({ handleDismiss, dismissPrompt }) {
  return (
    <Popup
      content={dismissPrompt}
      position="left center"
      inverted
      openOnTriggerFocus
      closeOnTriggerBlur
      trigger={
        <Button type="dismiss" compact onClick={handleDismiss} aria-label={dismissPrompt}>
          <span tabIndex="-1">
            <i className="material-icons">close</i>
          </span>
        </Button>
      }
    />
  );
}
