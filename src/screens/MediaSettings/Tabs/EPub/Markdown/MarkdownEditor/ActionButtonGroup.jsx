import React from 'react';
import { Button } from 'pico-ui';

function ActionButtonGroup({
  onSave,
  onClose,
}) {
  return (
    <div className="ee-md-act-btns-con">
      <Button.Group>
        <Button
          classNames="ee-md-act-btn"
          color="transparent teal"
          text="SAVE"
          onClick={onSave}
        />

        <Button
          classNames="ee-md-act-btn"
          color="transparent"
          text="CANCEL"
          onClick={onClose}
        />
      </Button.Group>
    </div>
  );
}

export default ActionButtonGroup;
