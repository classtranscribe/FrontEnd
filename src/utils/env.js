import { isDeveloping } from "./constants"
 
class ReactEnv {
  constructor() {
    const reactEnv = require('../env.json')
    this._baseURL = reactEnv.baseURL
    this._testingBaseURL = reactEnv.testingBaseURL
    this._auth0Domain = reactEnv.auth0Domain
    this._auth0ClientID = reactEnv.auth0ClientID
  }

  get baseURL() {
    return isDeveloping ? 
           this._testingBaseURL : 
           this._baseURL
  }

  get auth0Domain() {
    return this._auth0Domain
  }

  get auth0ClientID() {
    return this._auth0ClientID
  }
}

export const env = new ReactEnv()