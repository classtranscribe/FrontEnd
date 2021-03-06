import React, { useEffect } from 'react';
import { user, links } from 'utils';

function AuthCallback() {
  useEffect(() => {
    switch (window.location.pathname) {
      case links.auth0Callback():
        user.auth0Setup();
        break;
      case links.ciLogonCallback():
        user.ciLogonSetup();
        break;
      default:
        user.execCloseAfterSignIn();
        window.location = links.home();
        break;
    }
  }, []);

  return <div />;
}

export default AuthCallback;


