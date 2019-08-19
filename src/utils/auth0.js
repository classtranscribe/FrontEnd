import auth0 from 'auth0-js';

class Auth0 {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: process.env.REACT_APP_DOMAIN,
      audience: process.env.REACT_APP_AUDIENCE,
      clientID: process.env.REACT_APP_CLIENT_ID,
      redirectUri: process.env.REACT_APP_AUTH0_REDIRECT_URL,
      responseType: 'id_token',
      scope: 'openid email profile'
    });

    this.profile = {}
    this.idToken = ''

    this.getProfile = this.getProfile.bind(this);
    this.getAuth0Token = this.getAuth0Token.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  getProfile() {
    return this.profile
  }

  getAuth0Token() {
    return this.auth0Token
  }

  getRedirectURL = () => this.redirectURL

  signIn() {
    this.auth0.authorize({
      appState: {
        redirectURL: window.location.pathname
      }
    });
  }

  handleAuthentication() {
    const hash = window.location.hash
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({hash}, (err, authResult) => {
        if (err) return reject(err);
        if (!authResult || !authResult.idToken) {
          return reject(err);
        }
        this.auth0Token = authResult.idToken;
        this.profile = authResult.idTokenPayload;
        this.redirectURL = authResult.appState.redirectURL
        resolve();
      });
    })
  }

  signOut() {
    this.profile = {}
    this.idToken = ''
    this.auth0.logout()
  }
}

const auth0Client = new Auth0();

export default auth0Client;