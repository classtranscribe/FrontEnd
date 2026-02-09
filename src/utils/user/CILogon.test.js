import { CILogon } from './CILogon';

// Mock dependencies
jest.mock('../env', () => ({
  env: {
    ciLogonClientID: 'test-client-id',
    ciLogonSelectedIDP: 'selected-idp',
    ciLogonDefaultIDP: 'default-idp',
  },
}));

jest.mock('../links', () => ({
  links: {
    ciLogonCallback: () => '/cilogon-callback',
  },
}));

jest.mock('../use-url', () => ({
  uurl: {
    createSearch: jest.fn((params) => {
      const entries = Object.entries(params);
      return `?${entries.map(([k, v]) => `${k}=${v}`).join('&')}`;
    }),
    useSearch: jest.fn(() => ({ code: 'auth-code-123' })),
  },
}));

// Create mock redirect object inside factory
jest.mock('./redirect', () => ({
  __esModule: true,
  default: {
    saveRedirectURI: jest.fn(),
    getRedirectURI: jest.fn(() => '/redirect-target'),
    clear: jest.fn(),
  },
}));

describe.skip('CILogon', () => {
  let cilogon;
  let mockRedirect;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRedirect = require('./redirect').default;
    cilogon = new CILogon();
  });

  describe.skip('constructor', () => {
    it('sets callback URL', () => {
      expect(cilogon.callback).toBe('http://localhost/cilogon-callback');
    });
  });

  describe.skip('authorize', () => {
    it('saves redirect URI', () => {
      const originalLocation = window.location;

      // Mock window.location to prevent actual navigation
      delete window.location;
      window.location = { href: '' };

      cilogon.authorize('/custom-redirect');

      expect(mockRedirect.saveRedirectURI).toHaveBeenCalledWith('/custom-redirect');

      // Restore
      window.location = originalLocation;
    });

    it('navigates to CILogon authorize URL with correct params', () => {
      const { uurl } = require('../use-url');
      const originalLocation = window.location;

      delete window.location;
      window.location = { href: '' };

      cilogon.authorize('/test');

      expect(uurl.createSearch).toHaveBeenCalledWith({
        response_type: 'code',
        client_id: 'test-client-id',
        selected_idp: 'selected-idp',
        initialidp: 'default-idp',
        redirect_uri: 'http://localhost/cilogon-callback',
        scope: 'openid profile email',
      });

      expect(window.location).toContain('https://cilogon.org/authorize?');

      // Restore
      window.location = originalLocation;
    });
  });

  describe.skip('parseCallback', () => {
    it('returns token and redirect_uri from URL', () => {
      const result = cilogon.parseCallback();

      expect(mockRedirect.getRedirectURI).toHaveBeenCalled();
      expect(mockRedirect.clear).toHaveBeenCalled();
      expect(result).toEqual({
        token: 'auth-code-123',
        redirect_uri: '/redirect-target',
      });
    });

    it('extracts code from URL search params', () => {
      const { uurl } = require('../use-url');
      uurl.useSearch.mockReturnValueOnce({ code: 'different-code' });

      const result = cilogon.parseCallback();

      expect(result.token).toBe('different-code');
    });
  });
});
