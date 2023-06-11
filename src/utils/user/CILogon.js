import { env } from '../env';
import { links } from '../links';
import { uurl } from '../use-url';
import redirect from './redirect';

export class CILogon {
  constructor() {
    this.callback = window.location.origin + links.ciLogonCallback();
  }

  authorize(redirectURL) {
    redirect.saveRedirectURI(redirectURL);

    const query = uurl.createSearch({
      response_type: 'code',
      client_id: env.ciLogonClientID,
      selected_idp: env.ciLogonSelectedIDP,
      initialidp: env.ciLogonDefaultIDP,
      redirect_uri: this.callback,
      scope: 'openid profile email',
    });

    window.location = `https://cilogon.org/authorize${query}`;
  }

  parseCallback() {
    const redirectUri = redirect.getRedirectURI();
    redirect.clear();

    const { code } = uurl.useSearch();

    return {
      token: code,
      redirect_uri: redirectUri,
    };
  }
}
