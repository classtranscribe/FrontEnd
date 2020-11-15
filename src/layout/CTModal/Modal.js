import React from 'react';
import PropTypes from 'prop-types';
import { useTheme, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { CTFragment } from 'layout';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Modal(props) {
  const {
    open = false,
    size = 'sm',
    fullWidth = true,
    responsive,
    title,
    heading,
    children,
    action,
    onClose,
    darkMode,
    withCloseButton,
    autoFocusOnCloseButton,
    transition,
    disableEscapeKeyDown,
    disableBackdropClick,
    container,
    ...otherProps
  } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('xs'));
  const darkTheme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  });

  const dialogProps = {
    fullWidth,
    maxWidth: size,
    open,
    onClose,
    ...otherProps
  };

  if (responsive) {
    dialogProps.fullScreen = fullScreen;
  }

  if (transition) {
    dialogProps.TransitionComponent = Transition;
  }

  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog {...dialogProps}>
        {container ? children : (
          <>
            <CTFragment justConBetween alignItCenter padding={[0, 10, 0, 0]}>
              {title && <DialogTitle>{title}</DialogTitle>}
              {heading}
              {
                withCloseButton 
                && 
                <IconButton
                  onClick={onClose}
                  autoFocus={autoFocusOnCloseButton} 
                  aria-label="close"
                  style={{ outline: 'none' }}
                >
                  <i className="material-icons">close</i>
                </IconButton>
              }
            </CTFragment>

            <DialogContent>
              {children}
            </DialogContent>

            {action && <DialogActions>{action}</DialogActions>}
          </>
        )}
      </Dialog>
    </ThemeProvider>
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

  /** The heading element of the modal */
  heading: PropTypes.node,

  /** The primary content of the modal */
  children: PropTypes.node,

  /** The action element of the modal */
  action: PropTypes.node,

  /** The CTModal supports darkMode */
  darkMode: PropTypes.bool,

  /** True if display a close button at the top */
  withCloseButton: PropTypes.bool,

  /** True if auto focus on the close button */
  autoFocusOnCloseButton: PropTypes.bool,

  /** if `true` add transitive effect */
  transition: PropTypes.bool,

  /** If `true`, hitting escape will not fire the onClose callback. */
  disableEscapeKeyDown: PropTypes.bool,

  /** If `true`, clicking the backdrop will not fire the onClose callback. */
  disableBackdropClick: PropTypes.bool,

  /** If `true`, use the modal as a container: no header and action */
  container: PropTypes.bool
};

Modal.Text = DialogContentText;

export default Modal;