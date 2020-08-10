import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';

function ActionButtonGroup(props) {
  const { onSave, onClose } = props;

  return (
    <div className="ct-md-act-btns-con">
      <Button.Group>
        <Button
          classNames="ct-md-act-btn"
          color="transparent teal"
          text="SAVE"
          onClick={onSave}
        />

        <Button
          classNames="ct-md-act-btn"
          color="transparent"
          text="CANCEL"
          onClick={onClose}
        />
      </Button.Group>
    </div>
  );
}

ActionButtonGroup.propTypes = {
  onSave: PropTypes.func,
  onClose: PropTypes.func
};

export default ActionButtonGroup;
