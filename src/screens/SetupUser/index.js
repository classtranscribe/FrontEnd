import React from 'react';
import { user, util } from '../../utils';

const { links } = util;

export class SetupUser extends React.Component {
  componentDidMount() {
    const pathname = window.location.pathname;
    if (pathname === links.auth0Callback()) {
      user.auth0Setup();
    } else if (pathname === links.ciLogonCallback()) {
      user.ciLogonSetup();
    } else {
      window.location = links.home();
    }
  }

  render() {
    return <div />;
  }
}
