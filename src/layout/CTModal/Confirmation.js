import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import Modal from './Modal';

const useStyles = makeStyles({
  cancelBtn: {
    fontWeight: 'bold'
  },
  confirmBtn: {
    fontWeight: 'bold',
    marginLeft: 5,
    '&:not(.MuiButton-outlined)': {
      background: 'teal',
      color: 'white',
      '&:hover': {
        background: 'var(--ct-green-normal)',
      }
    }
  }
});

function Confirmation(props) {
  const {
    open = false,
    responsive = true,
    title = 'Confirmation',
    text,
    children,
    onClose,
    onConfirm,
    cancelButtonText = 'Cancel',
    confirmButtonText = 'Confirm',
    ...otherProps
  } = props;

  const classes = useStyles();

  const contentElement = text ? <Modal.Text>{text}</Modal.Text> : children;
  const handleConform = () => {
    if (typeof onConfirm === 'function') {
      onConfirm();
    }

    if (typeof onClose === 'function') {
      onClose();
    }
  }

  const actionElement = (
    <>
      <Button size="large" className={classes.cancelBtn} onClick={onClose}>
        {cancelButtonText}
      </Button>
      <Button size="large" className={classes.confirmBtn} onClick={handleConform}>
        {confirmButtonText}
      </Button>
    </>
  );

  const modalProps = {
    open,
    title,
    size: 'sm',
    responsive,
    onClose,
    action: actionElement,
    ...otherProps
  };

  return (
    <Modal {...modalProps}>
      {contentElement}
    </Modal>
  );
}

Confirmation.propTypes = {
  /** True if open the modal */
  open: Modal.propTypes.open,

  /** The size of the modal can be responsive to window's width */
  responsive: Modal.propTypes.responsive,

  /** The confirmation title */
  title: PropTypes.node,

  /** The confirmation text */
  text: PropTypes.node,

  /** Primary content */
  children: PropTypes.node,

  /** callback on close */
  onClose: PropTypes.func,

  /** callback on confirm */
  onConfirm: PropTypes.func,

  /** Customize the cancel-button's text */
  cancelButtonText: PropTypes.string,

  /** Customize the confirm-button's text */
  confirmButtonText: PropTypes.string,
};

export default Confirmation;

export function useConfirmation(text, onConfirm, otherProps) {
  const [open, setOpen] = useState(false);
  const onClose = () => setOpen(false);
  const onOpen = () => setOpen(true);

  const modalProps = { open, onConfirm, text, onClose, ...otherProps };
  const element = <Confirmation {...modalProps} />;

  return {
    element,
    open,
    onClose,
    onOpen
  };
};

