import auth0 from 'auth0-js';
import decoder from 'jwt-decode';
import { v4 as uuid } from 'uuid';
import { env } from '../env';
import { links } from '../links';
import redirect from './redirect';

export class Auth0 {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: env.auth0Domain,
      audience: `https://${env.auth0Domain}/api/v2/`,
      clientID: env.auth0ClientID,
      redirectUri: window.location.origin + links.auth0Callback(),
      responseType: 'id_token',
      scope: 'openid email profile',
    });

    this.profile = {};
    this.idToken = '';

    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getAuth0Token = this.getAuth0Token.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
  }

  getProfile() {
    return this.profile;
  }

  getAuth0Token() {
    return this.auth0Token;
  }

  getRedirectURL() {
    redirect.clear();
    return this.redirectURL || links.home();
  }

  getRedirectState() {
    return this.redirectState;
  }

  signIn(redirectURL = window.location.href) {
    redirect.saveRedirectURI(redirectURL);
    this.auth0.authorize({
      appState: { redirectURL },
      state: uuid(),
    });
  }

  handleAuthentication() {
    const hash = window.location.hash;
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ hash }, (err, authResult) => {
        // In the worst case, manually parse the token
        if (err) {
          const idToken = links.useHash().id_token;
          this.auth0Token = idToken;
          this.profile = decoder(idToken);
          this.redirectURL = redirect.getRedirectURI();
          resolve();
        }

        if (!authResult || !authResult.idToken) {
          return reject(err);
        }

        // get the user info from the auth0
        this.auth0Token = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.redirectURL = authResult.appState.redirectURL;
        this.redirectState = authResult.appState.redirectState;
        resolve();
      });
    });
  }

  signOut(returnTo = window.location.origin) {
    this.auth0.logout({ returnTo });
  }
}
