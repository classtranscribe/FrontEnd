const reactEnv = window.env;

/**
 * Throw the error on missing a required environment variable
 */
const missingRequiredEnv = (envName) => {
  throw Error(`Missing required environment variable ${envName}`);
};

const requiredEnvs = [
  'AUTH0_DOMAIN',
  'AUTH0_CLIENT_ID',
  'CILOGON_CLIENT_ID',
  'APPLICATION_INSIGHTS_KEY',
  'REACT_APP_FRONTEND_COMMIT_ENDPOINT',
];

/**
 * Class used to handle using environment variables
 */
class ReactEnv {
  constructor() {
    for (let i = 0; i < requiredEnvs.length; i += 1) {
      const envName = requiredEnvs[i];
      if (!reactEnv[envName]) {
        missingRequiredEnv(envName);
      }
    }
  }

  get dev() {
    return reactEnv.TEST_SIGN_IN === 'true';
  }

  get auth0Domain() {
    return reactEnv.AUTH0_DOMAIN;
  }

  get auth0ClientID() {
    return reactEnv.AUTH0_CLIENT_ID;
  }

  get ciLogonClientID() {
    return reactEnv.CILOGON_CLIENT_ID;
  }

  get frontendCommitEndpoint() {
    return reactEnv.REACT_APP_FRONTEND_COMMIT_ENDPOINT;
  }

  get azureInstrumentationKey() {
    return reactEnv.APPLICATION_INSIGHTS_KEY;
  }

  get productionServer() {
    return reactEnv.REACT_APP_API_BASE_URL || window.location.origin;
  }

  get devServer() {
    return reactEnv.REACT_APP_TESTING_BASE_URL || window.location.origin;
  }

  get baseURL() {
    return this.dev ? this.devServer : this.productionServer;
  }
}

export const env = new ReactEnv();
