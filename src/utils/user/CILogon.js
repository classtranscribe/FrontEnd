import { env } from '../env';
import { links } from '../links';
import redirect from './redirect';

export class CILogon {
  constructor() {
    this.callback = window.location.origin + links.ciLogonCallback();
  }

  authorize() {
    redirect.saveRedirectURI();

    const query = links.createSearch({
      response_type: 'code',
      client_id: env.ciLogonClientID,
      redirect_uri: this.callback,
      scope: 'openid profile email org.cilogon.userinfo edu.uiuc.ncsa.myproxy.getcert',
    });

    window.location = `https://cilogon.org/authorize${query}`;
  }

  parseCallback() {
    const redirectUri = redirect.getRedirectURI();
    redirect.clear();

    const { code } = links.useSearch();

    return {
      token: code,
      redirect_uri: redirectUri,
    };
  }
}
