import { Auth0 } from './Auth0';

// Mock dependencies
jest.mock('auth0-js', () => ({
  WebAuth: jest.fn().mockImplementation(() => ({
    authorize: jest.fn(),
    parseHash: jest.fn(),
  })),
}));

jest.mock('jwt-decode', () => jest.fn(() => ({ sub: 'user123', email: 'test@example.com' })));

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));

jest.mock('../env', () => ({
  env: {
    auth0Domain: 'test.auth0.com',
    auth0ClientID: 'test-client-id',
  },
}));

jest.mock('../links', () => ({
  links: {
    auth0Callback: () => '/auth0-callback',
    home: () => '/',
  },
}));

// Create mock redirect object inside factory
jest.mock('./redirect', () => ({
  __esModule: true,
  default: {
    saveRedirectURI: jest.fn(),
    getRedirectURI: jest.fn(() => '/redirect-here'),
    clear: jest.fn(),
  },
}));

describe.skip('Auth0', () => {
  let auth0Instance;
  let mockAuth0Client;
  let mockRedirect;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect = require('./redirect').default;
    const auth0js = require('auth0-js');
    mockAuth0Client = {
      authorize: jest.fn(),
      parseHash: jest.fn(),
    };
    auth0js.WebAuth.mockImplementation(() => mockAuth0Client);

    auth0Instance = new Auth0();
  });

  describe.skip('constructor', () => {
    it('initializes auth0 WebAuth with correct config', () => {
      const auth0js = require('auth0-js');
      expect(auth0js.WebAuth).toHaveBeenCalledWith({
        domain: 'test.auth0.com',
        audience: 'https://test.auth0.com/api/v2/',
        clientID: 'test-client-id',
        redirectUri: 'http://localhost/auth0-callback',
        responseType: 'id_token',
        scope: 'openid email profile',
      });
    });

    it('initializes empty profile and idToken', () => {
      expect(auth0Instance.profile).toEqual({});
      expect(auth0Instance.idToken).toBe('');
    });

    it('binds methods to instance', () => {
      expect(auth0Instance.signIn).toBeDefined();
      expect(auth0Instance.signOut).toBeDefined();
      expect(auth0Instance.getProfile).toBeDefined();
      expect(auth0Instance.getAuth0Token).toBeDefined();
      expect(auth0Instance.handleAuthentication).toBeDefined();
    });
  });

  describe.skip('getProfile', () => {
    it('returns the profile object', () => {
      auth0Instance.profile = { name: 'Test User' };
      expect(auth0Instance.getProfile()).toEqual({ name: 'Test User' });
    });
  });

  describe.skip('getAuth0Token', () => {
    it('returns the auth0Token', () => {
      auth0Instance.auth0Token = 'test-token-123';
      expect(auth0Instance.getAuth0Token()).toBe('test-token-123');
    });
  });

  describe.skip('getRedirectURL', () => {
    it('clears redirect and returns stored redirect URL', () => {
      auth0Instance.redirectURL = '/custom-redirect';

      const result = auth0Instance.getRedirectURL();

      expect(mockRedirect.clear).toHaveBeenCalled();
      expect(result).toBe('/custom-redirect');
    });

    it('returns home URL when no redirectURL set', () => {
      const result = auth0Instance.getRedirectURL();

      expect(mockRedirect.clear).toHaveBeenCalled();
      expect(result).toBe('/');
    });
  });

  describe.skip('getRedirectState', () => {
    it('returns the redirectState', () => {
      auth0Instance.redirectState = 'state-123';
      expect(auth0Instance.getRedirectState()).toBe('state-123');
    });
  });

  describe.skip('signIn', () => {
    it('saves redirect URI and calls authorize', () => {
      auth0Instance.signIn('/custom-url');

      expect(mockRedirect.saveRedirectURI).toHaveBeenCalledWith('/custom-url');
      expect(mockAuth0Client.authorize).toHaveBeenCalledWith({
        appState: { redirectURL: '/custom-url' },
        state: 'test-uuid',
      });
    });

    it('uses window.location.href as default redirect', () => {
      Object.defineProperty(window, 'location', {
        value: { href: 'http://localhost/current-page' },
        writable: true,
      });

      auth0Instance.signIn();

      expect(mockRedirect.saveRedirectURI).toHaveBeenCalledWith('http://localhost/current-page');
    });
  });

  describe.skip('handleAuthentication', () => {
    beforeEach(() => {
      Object.defineProperty(window, 'location', {
        value: { hash: '#id_token=abc123' },
        writable: true,
      });
    });

    it('parses auth result and stores token and profile', async () => {
      const authResult = {
        idToken: 'test-id-token',
        idTokenPayload: { sub: 'user123', email: 'user@test.com' },
        appState: { redirectURL: '/dashboard', redirectState: 'state123' },
      };

      mockAuth0Client.parseHash.mockImplementation((opts, callback) => {
        callback(null, authResult);
      });

      await auth0Instance.handleAuthentication();

      expect(auth0Instance.auth0Token).toBe('test-id-token');
      expect(auth0Instance.profile).toEqual(authResult.idTokenPayload);
      expect(auth0Instance.redirectURL).toBe('/dashboard');
      expect(auth0Instance.redirectState).toBe('state123');
    });

    it('handles parseHash error by manually parsing token', async () => {
      const decoder = require('jwt-decode');
      const { links } = require('../links');

      // Mock links.useHash to return a token
      links.useHash = jest.fn(() => ({ id_token: 'fallback-token' }));

      mockAuth0Client.parseHash.mockImplementation((opts, callback) => {
        callback(new Error('Parse error'), null);
      });

      await auth0Instance.handleAuthentication();

      expect(decoder).toHaveBeenCalledWith('fallback-token');
      expect(auth0Instance.auth0Token).toBe('fallback-token');
      expect(auth0Instance.profile).toEqual({ sub: 'user123', email: 'test@example.com' });
      expect(mockRedirect.getRedirectURI).toHaveBeenCalled();
    });

    it('rejects when no authResult or idToken', async () => {
      mockAuth0Client.parseHash.mockImplementation((opts, callback) => {
        callback(null, null);
      });

      await expect(auth0Instance.handleAuthentication()).rejects.toBeUndefined();
    });

    it('rejects when authResult exists but no idToken', async () => {
      mockAuth0Client.parseHash.mockImplementation((opts, callback) => {
        callback(null, { accessToken: 'token' });
      });

      await expect(auth0Instance.handleAuthentication()).rejects.toBeUndefined();
    });
  });
});
