import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';

function ImagePickerModalActions(props) {
  const { onClose, onSave } = props;
  return (
    <Button.Group>
      <Button
        uppercase
        text="Save"
        color="teal"
        onClick={onSave}
        className="mr-4 mb-2"
      />
      {/* <Button
        uppercase
        compact
        text="Close"
        color="transparent teal"
        onClick={onClose}
      /> */}
    </Button.Group>
  );
}

ImagePickerModalActions.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func
};

export default ImagePickerModalActions;
