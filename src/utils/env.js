import { isDeveloping } from "./constants"

class ReactEnv {
  constructor() {
    const reactEnv = window.env
    // console.log('reactEnv', reactEnv)
    this._baseURL = reactEnv.REACT_APP_API_BASE_URL
    this._testingBaseURL = reactEnv.REACT_APP_TESTING_BASE_URL
    this._auth0Domain = reactEnv.AUTH0_DOMAIN
    this._auth0ClientID = reactEnv.AUTH0_CLIENT_ID
    this._dev = reactEnv.TEST_SIGN_IN
    this._frontendCommitEndpoint = reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT
  }

  get baseURL() {
    return this.dev ? 
           this._testingBaseURL : this._baseURL
  }

  get auth0Domain() {
    return this._auth0Domain
  }

  get auth0ClientID() {
    return this._auth0ClientID
  }

  get dev() {
    return this._dev === 'true'
  }

  get frontendCommitEndpoint() {
    return this._frontendCommitEndpoint
  }
}

export const env = new ReactEnv()