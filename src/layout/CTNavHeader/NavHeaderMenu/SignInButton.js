import React from 'react';
import { Link } from 'react-router-dom';
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

function SignInButton() {
  const btnProps = useSignButtonProps();

  return (
    <Button {...btnProps}>
      SIGN IN
    </Button>
  );
}

export default SignInButton;

