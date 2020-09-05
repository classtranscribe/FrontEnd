import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'pico-ui';
import { CTText, CTFragment } from 'layout';

function ActionButtonGroup(props) {
  const { onSave, onClose } = props;

  return (
    <CTFragment alignItCenter justConBetween className="ct-md-act-btns-con">
      <CTText padding={[0, 20]}><b>ctrl + s</b> to save the changes</CTText>

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
    </CTFragment>
  );
}

ActionButtonGroup.propTypes = {
  onSave: PropTypes.func,
  onClose: PropTypes.func
};

export default ActionButtonGroup;
