import { User } from './User';

// Mock all dependencies
jest.mock('jwt-decode', () => jest.fn());
jest.mock('../cthttp/entities/Account');
jest.mock('../env', () => ({
  env: {
    dev: false,
    baseURL: 'https://api.test.com',
  },
}));
jest.mock('../links', () => ({
  links: {
    home: () => '/',
    admin: () => '/admin',
    instructor: () => '/instructor',
    auth0Callback: () => '/auth0-callback',
    ciLogonCallback: () => '/cilogon-callback',
  },
}));
jest.mock('../prompt', () => ({
  prompt: {
    error: jest.fn(),
  },
}));
jest.mock('../use-url', () => ({
  uurl: {
    isEqual: jest.fn(() => false),
  },
}));
jest.mock('./Auth0');
jest.mock('./CILogon');
jest.mock('./storage', () => ({
  accountStorage: {
    authToken: null,
    loginAsUserInfo: {},
    userInfo: null,
    setAuthToken: jest.fn(),
    setUserInfo: jest.fn(),
    setLoginAsUserInfo: jest.fn(),
    setCloseAfterSignedIn: jest.fn(),
    rmCloseAfterSignedIn: jest.fn(),
    closeAfterSignedIn: false,
    remove: jest.fn(),
  },
}));

describe.skip('User', () => {
  let user;
  let mockAuth0Client;
  let mockCILogonClient;

  beforeEach(() => {
    jest.clearAllMocks();

    const { Auth0 } = require('./Auth0');
    const { CILogon } = require('./CILogon');

    mockAuth0Client = {
      signIn: jest.fn(),
      signOut: jest.fn(),
      handleAuthentication: jest.fn(),
      getAuth0Token: jest.fn(() => 'auth0-token'),
      getProfile: jest.fn(() => ({ email: 'test@example.com' })),
    };

    mockCILogonClient = {
      authorize: jest.fn(),
      parseCallback: jest.fn(() => ({ token: 'cilogon-token', redirect_uri: '/' })),
    };

    Auth0.mockImplementation(() => mockAuth0Client);
    CILogon.mockImplementation(() => mockCILogonClient);

    user = new User();

    // Reset storage
    const { accountStorage } = require('./storage');
    accountStorage.authToken = null;
    accountStorage.userInfo = null;
    accountStorage.loginAsUserInfo = {};
  });

  describe('constructor', () => {
    it('creates Auth0 and CILogon client instances', () => {
      expect(user.auth0Client).toBe(mockAuth0Client);
      expect(user.ciLogonClient).toBe(mockCILogonClient);
    });

    it('binds methods to instance', () => {
      expect(user.signIn).toBeDefined();
      expect(user.signOut).toBeDefined();
      expect(user.validate).toBeDefined();
    });
  });

  describe('method constants', () => {
    it('exports auth method constants', () => {
      expect(user.method.AUTH0).toBe('auth0');
      expect(user.method.CILOGON).toBe('cilogon');
      expect(user.method.TEST).toBe('test');
    });

    it('has authMethods array', () => {
      expect(user.authMethods).toContain('auth0');
      expect(user.authMethods).toContain('cilogon');
      expect(user.authMethods).toContain('test');
    });

    it('has callbackPaths array', () => {
      expect(user.callbackPaths).toEqual(['/auth0-callback', '/cilogon-callback']);
    });
  });

  describe('isLoggedIn', () => {
    it('returns false when no userId', () => {
      expect(user.isLoggedIn).toBe(false);
    });

    it('returns true when userId exists', () => {
      const { accountStorage } = require('./storage');
      accountStorage.userInfo = { userId: 'user123' };
      expect(user.isLoggedIn).toBe(true);
    });
  });

  describe('isAdmin', () => {
    it('returns false when no roles', () => {
      require('./storage').accountStorage.userInfo = { roles: [] };
      expect(user.isAdmin).toBe(false);
    });

    it('returns true when user has admin role', () => {
      require('./storage').accountStorage.userInfo = { roles: ['admin'], userId: 'admin123' };
      expect(user.isAdmin).toBe(true);
    });

    it('returns false when user has other roles', () => {
      require('./storage').accountStorage.userInfo = { roles: ['instructor'] };
      expect(user.isAdmin).toBe(false);
    });
  });

  describe('isInstructor', () => {
    it('returns false when no roles', () => {
      require('./storage').accountStorage.userInfo = { roles: [] };
      expect(user.isInstructor).toBe(false);
    });

    it('returns true when user has instructor role', () => {
      require('./storage').accountStorage.userInfo = { roles: ['instructor'], userId: 'inst123' };
      expect(user.isInstructor).toBe(true);
    });
  });

  describe('userId', () => {
    it('returns loginAs userId when available and not on admin page', () => {
      const { uurl } = require('../use-url');

      require('./storage').accountStorage.userInfo = { userId: 'real-user' };
      require('./storage').accountStorage.loginAsUserInfo = { userId: 'login-as-user' };
      uurl.isEqual.mockReturnValue(false);

      expect(user.userId).toBe('login-as-user');
    });

    it('returns real userId on admin page', () => {
      const { uurl } = require('../use-url');

      require('./storage').accountStorage.userInfo = { userId: 'real-user' };
      require('./storage').accountStorage.loginAsUserInfo = { userId: 'login-as-user' };
      uurl.isEqual.mockReturnValue(true);

      expect(user.userId).toBe('real-user');
    });

    it('returns real userId when no loginAs user', () => {
      require('./storage').accountStorage.userInfo = { userId: 'real-user' };

      expect(user.userId).toBe('real-user');
    });
  });

  describe('signIn', () => {
    it('calls auth0SignIn by default', () => {
      const auth0SignInSpy = jest.spyOn(user, 'auth0SignIn').mockImplementation();
      user.signIn();
      expect(auth0SignInSpy).toHaveBeenCalled();
    });

    it('calls ciLogonSignIn when method is cilogon', () => {
      const ciLogonSignInSpy = jest.spyOn(user, 'ciLogonSignIn').mockImplementation();
      user.signIn({ method: 'cilogon' });
      expect(ciLogonSignInSpy).toHaveBeenCalled();
    });

    it('calls testSignIn when in dev mode and method is test', () => {
      const { env } = require('../env');
      env.dev = true;
      const testSignInSpy = jest.spyOn(user, 'testSignIn').mockImplementation();
      user.signIn({ method: 'test' });
      expect(testSignInSpy).toHaveBeenCalled();
      env.dev = false;
    });

    it('sets closeAfterSignedIn flag when requested', () => {
      jest.spyOn(user, 'auth0SignIn').mockImplementation();

      user.signIn({ closeAfterSignedIn: true });

      expect(require('./storage').accountStorage.setCloseAfterSignedIn).toHaveBeenCalled();
    });

    it('removes closeAfterSignedIn flag when false', () => {
      jest.spyOn(user, 'auth0SignIn').mockImplementation();

      user.signIn({ closeAfterSignedIn: false });

      expect(require('./storage').accountStorage.rmCloseAfterSignedIn).toHaveBeenCalled();
    });
  });

  describe('auth0SignIn', () => {
    it('delegates to auth0Client.signIn', () => {
      user.auth0SignIn('/redirect');
      expect(mockAuth0Client.signIn).toHaveBeenCalledWith('/redirect');
    });
  });

  describe('ciLogonSignIn', () => {
    it('delegates to ciLogonClient.authorize', () => {
      user.ciLogonSignIn('/redirect');
      expect(mockCILogonClient.authorize).toHaveBeenCalledWith('/redirect');
    });
  });

  describe('testSignIn', () => {
    it('calls Account.testSignIn and saves auth token', async () => {
      const Account = require('../cthttp/entities/Account');

      Account.testSignIn = jest.fn().mockResolvedValue({
        data: { authToken: 'test-token', userId: 'test-user' },
      });

      Object.defineProperty(window, 'location', {
        value: '/test',
        writable: true,
      });

      await user.testSignIn('/redirect');

      expect(Account.testSignIn).toHaveBeenCalled();
      expect(require('./storage').accountStorage.setAuthToken).toHaveBeenCalledWith('test-token');
    });
  });

  describe('reSignIn', () => {
    it('clears localStorage and calls signIn with stored auth method', () => {
      require('./storage').accountStorage.userInfo = { authMethod: 'auth0', userId: 'user123' };

      const signInSpy = jest.spyOn(user, 'signIn').mockImplementation();
      const clearSpy = jest.spyOn(localStorage, 'clear');

      user.reSignIn();

      expect(clearSpy).toHaveBeenCalled();
      expect(signInSpy).toHaveBeenCalledWith({ method: 'auth0' });
    });
  });

  describe('signOut', () => {
    it('does nothing when not logged in', () => {
      require('./storage').accountStorage.userInfo = null;

      const clearSpy = jest.spyOn(localStorage, 'clear');
      user.signOut();

      expect(clearSpy).not.toHaveBeenCalled();
    });

    it('clears localStorage and calls auth0SignOut for auth0 users', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', authMethod: 'auth0' };

      const clearSpy = jest.spyOn(localStorage, 'clear');
      const auth0SignOutSpy = jest.spyOn(user, 'auth0SignOut').mockImplementation();

      user.signOut();

      expect(clearSpy).toHaveBeenCalled();
      expect(auth0SignOutSpy).toHaveBeenCalled();
    });

    it('calls ciLogonSignOut for cilogon users', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', authMethod: 'cilogon' };

      const ciLogonSignOutSpy = jest.spyOn(user, 'ciLogonSignOut').mockImplementation();

      user.signOut();

      expect(ciLogonSignOutSpy).toHaveBeenCalled();
    });

    it('calls testSignOut for test users', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', authMethod: 'test' };

      const testSignOutSpy = jest.spyOn(user, 'testSignOut').mockImplementation();

      user.signOut();

      expect(testSignOutSpy).toHaveBeenCalled();
    });

    it('uses provided returnTo URL', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', authMethod: 'auth0' };

      const auth0SignOutSpy = jest.spyOn(user, 'auth0SignOut').mockImplementation();

      user.signOut('/custom-return');

      expect(auth0SignOutSpy).toHaveBeenCalledWith('/custom-return');
    });

    it('defaults to window.location.origin', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', authMethod: 'auth0' };

      Object.defineProperty(window, 'location', {
        value: { origin: 'http://localhost:3000' },
        writable: true,
      });

      const auth0SignOutSpy = jest.spyOn(user, 'auth0SignOut').mockImplementation();

      user.signOut();

      expect(auth0SignOutSpy).toHaveBeenCalledWith('http://localhost:3000');
    });
  });

  describe('auth0SignOut', () => {
    it('delegates to auth0Client.signOut', () => {
      user.auth0SignOut('/return');
      expect(mockAuth0Client.signOut).toHaveBeenCalledWith('/return');
    });
  });

  describe('redirect', () => {
    it('redirects to provided path', () => {
      require('./storage').accountStorage.userInfo = { userId: 'user123', roles: [] };

      Object.defineProperty(window, 'location', {
        value: '',
        writable: true,
      });

      user.redirect('/custom-path');

      expect(window.location).toBe('/custom-path');
    });

    it('redirects admins to admin page from home', () => {
      require('./storage').accountStorage.userInfo = { userId: 'admin', roles: ['admin'] };

      Object.defineProperty(window, 'location', {
        value: '',
        writable: true,
      });

      user.redirect('/');

      expect(window.location).toBe('/admin');
    });

    it('redirects instructors to instructor page from home', () => {
      require('./storage').accountStorage.userInfo = { userId: 'instructor', roles: ['instructor'] };

      Object.defineProperty(window, 'location', {
        value: '',
        writable: true,
      });

      user.redirect('/');

      expect(window.location).toBe('/instructor');
    });

    it('does not redirect admin from non-home path', () => {
      require('./storage').accountStorage.userInfo = { userId: 'admin', roles: ['admin'] };

      Object.defineProperty(window, 'location', {
        value: '',
        writable: true,
      });

      user.redirect('/videos');

      expect(window.location).toBe('/videos');
    });
  });
});
