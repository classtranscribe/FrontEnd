import React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function Modal(props) {
  const {
    open = false,
    size = 'sm',
    fullWidth = true,
    responsive = false,
    title,
    children,
    action,
    onClose,
    ...otherProps
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));

  return (
    <Dialog
      fullScreen={responsive ? fullScreen : false}
      fullWidth={fullWidth}
      maxWidth={size}
      open={open}
      onClose={onClose}
      {...otherProps}
    >
      {title && <DialogTitle>{title}</DialogTitle>}

      <DialogContent>
        {children}
      </DialogContent>

      {action && <DialogActions>{action}</DialogActions>}
    </Dialog>
  );
}

Modal.propTypes = {
  /** True if diaplay the modal */
  open: PropTypes.bool,

  /** The size of the modal, one of 'xs', 'sm', 'md', 'lg', 'xl' */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),

  /** True if strict to the size of the modal, default to be true */
  fullWidth: PropTypes.bool,

  /** The size of the modal can be responsive to window's width */
  responsive: PropTypes.bool,

  /** The function to close the modal */
  onClose: PropTypes.func,

  /** The title element of the modal */
  title: PropTypes.node,

  /** The primary content of the modal */
  children: PropTypes.node,

  /** The action element of the modal */
  action: PropTypes.node,
};

Modal.Text = DialogContentText;

export default Modal;

