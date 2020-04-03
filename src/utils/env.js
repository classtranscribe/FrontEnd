const reactEnv = window.env

/**
 * Throw the error on missing a required environment variable
 * @param {String} envName 
 */
const missingRequiredEnv = envName => {
  throw Error('Missing required environment variable ' + envName)
}

/**
 * Class used to handle using environment variables
 */
class ReactEnv {
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
    if (!reactEnv.REACT_APP_AZURE_INSTRUMENTATION_KEY) missingRequiredEnv('REACT_APP_AZURE_INSTRUMENTATION_KEY')
    return reactEnv.REACT_APP_AZURE_INSTRUMENTATION_KEY
  }

  get productionServer() {
    if (!reactEnv.REACT_APP_API_BASE_URL) missingRequiredEnv('REACT_APP_API_BASE_URL')
    return reactEnv.REACT_APP_API_BASE_URL
  }

  get devServer() {
    if (!reactEnv.REACT_APP_TESTING_BASE_URL) missingRequiredEnv('REACT_APP_TESTING_BASE_URL')
    return reactEnv.REACT_APP_TESTING_BASE_URL
  }

  get baseURL() {
    return this.dev 
          ? this.devServer
          : this.productionServer
  }
}

export const env = new ReactEnv()