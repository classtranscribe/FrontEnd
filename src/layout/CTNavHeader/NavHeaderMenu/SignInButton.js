import React from 'react';
import { Link } from 'dva/router';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { links } from 'utils';
import { useButtonStyles } from '../../CTButtons';

export function useSignButtonProps(redirect) {
  const btn = useButtonStyles();

  return {
    component: Link,
    variant: 'contained',
    to: links.signIn({ redirect }),
    className: btn.teal
  }
}

function SignInButton(props) {
  const {
    targetBlank,
    closeAfterSignedIn,
    onAfterClick
  } = props;

  const btnProps = useSignButtonProps();

  if (typeof onAfterClick === 'function') {
    btnProps.onClick = onAfterClick;
  }

  if (targetBlank) {
    btnProps.target = '_blank';
  }

  if (closeAfterSignedIn) {
    btnProps.component = 'button';
    btnProps.onClick = (event) => {
      event.preventDefault();
      let siWdw = window.open(links.signIn({ aspopup: 'true' }), '_blank');
      siWdw.closeAfterSignedIn = true;
      siWdw.onSignedIn = () => {
        window.close();
      }

      window.onfocus = () => {
        if (siWdw.closed) {
          window.onfocus = undefined;
          window.location.reload();
        }
      }

      if (typeof onAfterClick === 'function') {
        onAfterClick();
      }
    }
  }

  return (
    <Button {...btnProps}>
      SIGN IN
    </Button>
  );
}

SignInButton.propTypes = {
  /** True if open the sign-in page in a new window by setting `target="_blank"` */
  targetBlank: PropTypes.bool,

  /**
   * True if you want to closed the window after signin processed finished
   * works iff `targetBlank` is set to be true
  */
  closeAfterSignedIn: PropTypes.bool,

  /** Function called after the sign in button is clicked */
  onAfterClick: PropTypes.func
}

export default SignInButton;

