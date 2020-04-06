const reactEnv = window.env

/**
 * Throw the error on missing a required environment variable
 * @param {String} envName 
 */
const missingRequiredEnv = envName => {
  throw Error('Missing required environment variable ' + envName)
}

const usingWindowOrigin = envName => {
  console.warn('Missing environment variable ' + envName + '. Start using window.location.origin.')
}

/**
 * Class used to handle using environment variables
 */
class ReactEnv {
  constructor() {
    if (!reactEnv.AUTH0_DOMAIN) missingRequiredEnv('AUTH0_DOMAIN')
    if (!reactEnv.AUTH0_CLIENT_ID) missingRequiredEnv('AUTH0_CLIENT_ID')
    if (!reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT) missingRequiredEnv('REACT_APP_FRONTEND_COMMIT_ENDPOINT')
    if (!reactEnv.APPLICATION_INSIGHTS_KEY) missingRequiredEnv('APPLICATION_INSIGHTS_KEY')
  }

  get auth0Domain() {
    if (!reactEnv.AUTH0_DOMAIN) missingRequiredEnv('AUTH0_DOMAIN')
    return reactEnv.AUTH0_DOMAIN
  }

  get auth0ClientID() {
    if (!reactEnv.AUTH0_CLIENT_ID) missingRequiredEnv('AUTH0_CLIENT_ID')
    return reactEnv.AUTH0_CLIENT_ID
  }

  get dev() {
    return reactEnv.TEST_SIGN_IN === 'true'
  }

  get frontendCommitEndpoint() {
    if (!reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT) missingRequiredEnv('REACT_APP_FRONTEND_COMMIT_ENDPOINT')
    return reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT
  }

  get azureInstrumentationKey() {
    if (!reactEnv.APPLICATION_INSIGHTS_KEY) missingRequiredEnv('APPLICATION_INSIGHTS_KEY')
    return reactEnv.APPLICATION_INSIGHTS_KEY
  }

  get productionServer() {
    if (!reactEnv.REACT_APP_API_BASE_URL) usingWindowOrigin('REACT_APP_API_BASE_URL')
    return reactEnv.REACT_APP_API_BASE_URL || window.location.origin
  }

  get devServer() {
    if (!reactEnv.REACT_APP_TESTING_BASE_URL) usingWindowOrigin('REACT_APP_TESTING_BASE_URL')
    return reactEnv.REACT_APP_TESTING_BASE_URL || window.location.origin
  }

  get baseURL() {
    return this.dev 
          ? this.devServer
          : this.productionServer
  }
}

export const env = new ReactEnv()