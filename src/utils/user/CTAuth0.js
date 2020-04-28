import auth0 from 'auth0-js'
import decoder from 'jwt-decode'
import { env } from '../env'
import { links } from 'utils/links'
import { v4 as uuid } from 'uuid'

export const REDIRECT_URL_KEY = 'redirect_url'

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

  getRedirectURL = () => {
    localStorage.removeItem(REDIRECT_URL_KEY)
    return this.redirectURL || links.home()
  }
  getRedirectSearch = () => this.redirectSearch
  getRedirectState = () => this.redirectState

  signIn() {
    localStorage.setItem(REDIRECT_URL_KEY, window.location.href)
    this.auth0.authorize({
      appState: {
        redirectURL: window.location.href
      },
      state: uuid()
    });
  }

  handleAuthentication() {
    const hash = window.location.hash
    return new Promise((resolve, reject) => {
      this.auth0.parseHash({ hash }, (err, authResult) => {

        // In the worst case, manually parse the token
        if (err) {
          let { id_token } = links.useHash()
          this.auth0Token = id_token
          this.profile = decoder(id_token)
          this.redirectURL = localStorage.getItem(REDIRECT_URL_KEY)
          resolve();
        }

        if (!authResult || !authResult.idToken) {
          return reject(err)
        }

        // get the user info from the auth0
        this.auth0Token = authResult.idToken
        this.profile = authResult.idTokenPayload
        this.redirectURL = authResult.appState.redirectURL
        this.redirectSearch = authResult.appState.redirectSearch
        this.redirectState = authResult.appState.redirectState
        resolve();
      });
    })
  }

  signOut() {
    this.auth0.logout({ 
      returnTo: window.location.origin
    })
  }
}