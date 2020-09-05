import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { useButtonStyles, CTFragment } from 'layout';

function ImagePickerModalActions(props) {
  const { onClose, onSave, canSave } = props;
  const btn = useButtonStyles();

  return (
    <CTFragment justConEnd padding={[0, 20, 10, 0]}>
      <Button
        disabled={!canSave}
        onClick={onSave}
        className={cx(btn.teal, 'mr-2')}
        variant="contained"
      >
        save
      </Button>
      <Button
        className={btn.tealLink}
        onClick={onClose}
      >
        cancel
      </Button>
    </CTFragment>
  );
}

ImagePickerModalActions.propTypes = {
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  canSave: PropTypes.bool
};

export default ImagePickerModalActions;
