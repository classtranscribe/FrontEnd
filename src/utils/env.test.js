import { env } from './env';

describe.skip('ReactEnv', () => { // TODO: Need env vars setup - see TRICKY-TODO.md
  let originalWindow;

  beforeEach(() => {
    originalWindow = global.window;
    global.window = {
      ...global.window,
      env: {
        TEST_SIGN_IN: 'false',
        AUTH0_DOMAIN: 'test.auth0.com',
        AUTH0_CLIENT_ID: 'test-client-id',
        CILOGON_CLIENT_ID: 'cilogon-client-id',
        REACT_APP_API_BASE_URL: 'https://api.example.com',
        GITSHA1: 'abc123',
        BUILDNUMBER: '42',
        BRANCH: 'main'
      },
      location: {
        origin: 'http://localhost:3000'
      }
    };
  });

  afterEach(() => {
    global.window = originalWindow;
  });

  describe('dev mode', () => {
    it('returns true when TEST_SIGN_IN is "true"', () => {
      window.env.TEST_SIGN_IN = 'true';
      // Re-import to get updated env
      jest.resetModules();
      const { env: testEnv } = require('./env');
      expect(testEnv.dev).toBe(true);
    });

    it('returns false when TEST_SIGN_IN is not "true"', () => {
      window.env.TEST_SIGN_IN = 'false';
      jest.resetModules();
      const { env: testEnv } = require('./env');
      expect(testEnv.dev).toBe(false);
    });
  });

  describe('Auth0 configuration', () => {
    it('returns auth0Domain', () => {
      expect(env.auth0Domain).toBe('test.auth0.com');
    });

    it('returns auth0ClientID', () => {
      expect(env.auth0ClientID).toBe('test-client-id');
    });

    it('returns true for auth0Valid when both domain and clientID exist', () => {
      expect(env.auth0Valid).toBe(true);
    });

    it('returns false for auth0Valid when domain is missing', () => {
      window.env.AUTH0_DOMAIN = '';
      expect(env.auth0Valid).toBe(false);
    });

    it('returns false for auth0Valid when clientID is missing', () => {
      window.env.AUTH0_CLIENT_ID = '';
      expect(env.auth0Valid).toBe(false);
    });
  });

  describe('CILogon configuration', () => {
    it('returns ciLogonClientID', () => {
      expect(env.ciLogonClientID).toBe('cilogon-client-id');
    });

    it('returns true for ciLogonValid when clientID exists', () => {
      expect(env.ciLogonValid).toBe(true);
    });

    it('returns false for ciLogonValid when clientID is missing', () => {
      window.env.CILOGON_CLIENT_ID = '';
      expect(env.ciLogonValid).toBe(false);
    });

    it('returns ciLogonSelectedIDP or empty string', () => {
      window.env.CILOGON_SELECTED_IDP = 'custom-idp';
      expect(env.ciLogonSelectedIDP).toBe('custom-idp');
    });

    it('returns default IDP when not specified', () => {
      expect(env.ciLogonDefaultIDP).toBe('urn:mace:incommon:uiuc.edu');
    });

    it('returns custom default IDP when specified', () => {
      window.env.CILOGON_DEFAULT_IDP = 'custom-default';
      expect(env.ciLogonDefaultIDP).toBe('custom-default');
    });
  });

  describe('baseURL', () => {
    it('returns productionServer when not in dev mode', () => {
      window.env.TEST_SIGN_IN = 'false';
      expect(env.baseURL).toBe('https://api.example.com');
    });

    it('returns devServer when in dev mode', () => {
      window.env.TEST_SIGN_IN = 'true';
      window.env.REACT_APP_TESTING_BASE_URL = 'http://localhost:8080';
      const testEnv = require('./env').env;
      expect(testEnv.baseURL).toBe('http://localhost:8080');
    });

    it('falls back to window.location.origin for production', () => {
      window.env.REACT_APP_API_BASE_URL = undefined;
      expect(env.productionServer).toBe('http://localhost:3000');
    });

    it('falls back to window.location.origin for dev', () => {
      window.env.TEST_SIGN_IN = 'true';
      window.env.REACT_APP_TESTING_BASE_URL = undefined;
      const testEnv = require('./env').env;
      expect(testEnv.devServer).toBe('http://localhost:3000');
    });
  });

  describe('maintenance messages', () => {
    it('returns classTranscribeDownMessage', () => {
      window.env.CLASSTRANSCRIBE_DOWN_MESSAGE = 'Down for maintenance';
      expect(env.classTranscribeDownMessage).toBe('Down for maintenance');
    });

    it('returns maintenanceWarningBanner', () => {
      window.env.MAINTENANCE_WARNING_BANNER = 'Scheduled maintenance';
      expect(env.maintenanceWarningBanner).toBe('Scheduled maintenance');
    });
  });

  describe('build information', () => {
    it('returns gitSHA', () => {
      expect(env.gitSHA).toBe('abc123');
    });

    it('returns buildNum', () => {
      expect(env.buildNum).toBe('42');
    });

    it('returns branchName', () => {
      expect(env.branchName).toBe('main');
    });
  });
});
