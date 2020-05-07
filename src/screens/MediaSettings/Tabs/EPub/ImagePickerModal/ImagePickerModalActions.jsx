import React from 'react';
import { Button } from 'pico-ui';

function ImagePickerModalActions({
  onClose,
  onSave
}) {
  return (
    <Button.Group>
      <Button uppercase compact
        text="Save"
        color="teal"
        onClick={onSave}
      />
      <Button uppercase compact
        text="Close"
        color="transparent teal"
        onClick={onClose}
      />
    </Button.Group>
  );
}

export default ImagePickerModalActions;
