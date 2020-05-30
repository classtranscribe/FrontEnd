import React from 'react';
import { CTErrorWrapper } from 'components';
import { user } from 'utils';

export function ErrorWrapper({ error = {} }) {
  return (
    <CTErrorWrapper
      show
      dark
      goHomeButton 
      signInButton={!user.isLoggedIn} 
      {...error}
    />
  );
}
