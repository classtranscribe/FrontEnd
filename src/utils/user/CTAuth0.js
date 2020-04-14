import auth0 from 'auth0-js';
import { env } from '../env';

export class CTAuth0 {
  constructor() {
    this.auth0 = new auth0.WebAuth({
      // the following three lines MUST be updated
      domain: env.auth0Domain,
      audience: "https://" + env.auth0Domain + "/api/v2/",
      clientID: env.auth0ClientID,
      redirectUri: window.location.origin + "/login",
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

  getRedirectURL = () => this.redirectURL + this.redirectSearch
  getRedirectSearch = () => this.redirectSearch
  getRedirectState = () => this.redirectState

  signIn() {
    this.auth0.authorize({
      appState: {
        redirectURL: window.location.href,
        redirectSearch: window.location.search,
        redirectState: window.location.state
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
        this.redirectSearch = authResult.appState.redirectSearch
        this.redirectState = authResult.appState.redirectState
        resolve();
      });
    })
  }

  signOut() {
    this.profile = {}
    this.idToken = ''
    this.auth0.logout({ 
      returnTo: window.location.origin
    })
  }
}