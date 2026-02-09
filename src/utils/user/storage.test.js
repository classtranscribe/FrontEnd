import { accountStorage } from './storage';

describe('accountStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('authToken', () => {
    it('sets and gets auth token', () => {
      accountStorage.setAuthToken('test-token-123');
      expect(accountStorage.authToken).toBe('test-token-123');
    });

    it('returns null when no token is set', () => {
      expect(accountStorage.authToken).toBeNull();
    });
  });

  describe('userInfo', () => {
    it('sets and gets user info as object', () => {
      const userInfo = {
        firstName: 'John',
        lastName: 'Doe',
        emailId: 'john@example.com',
        userId: 'user123',
      };

      accountStorage.setUserInfo(userInfo);
      expect(accountStorage.userInfo).toEqual(userInfo);
    });

    it('handles string input', () => {
      const userInfoStr = JSON.stringify({ firstName: 'Jane', lastName: 'Smith' });
      accountStorage.setUserInfo(userInfoStr);
      expect(accountStorage.userInfo).toEqual({ firstName: 'Jane', lastName: 'Smith' });
    });

    it('returns empty object when no user info is set', () => {
      expect(accountStorage.userInfo).toEqual({});
    });

    it('stores complex user info structure', () => {
      const complexUserInfo = {
        firstName: 'John',
        lastName: 'Doe',
        fullName: 'John Doe',
        picture: 'https://example.com/pic.jpg',
        roles: ['Admin', 'Instructor'],
        exp: 1234567890,
        userId: 'user123',
        emailId: 'john@example.com',
        universityId: 'univ123',
        authToken: 'token123',
        authMethod: 'Auth0',
        metadata: { key: 'value' },
      };

      accountStorage.setUserInfo(complexUserInfo);
      expect(accountStorage.userInfo).toEqual(complexUserInfo);
    });
  });

  describe('loginAsUserInfo', () => {
    it('sets and gets login as user info', () => {
      const loginAsInfo = {
        firstName: 'Admin',
        lastName: 'User',
        userId: 'admin123',
      };

      accountStorage.setLoginAsUserInfo(loginAsInfo);
      expect(accountStorage.loginAsUserInfo).toEqual(loginAsInfo);
    });

    it('handles string input', () => {
      const loginAsInfoStr = JSON.stringify({ firstName: 'Admin', lastName: 'User' });
      accountStorage.setLoginAsUserInfo(loginAsInfoStr);
      expect(accountStorage.loginAsUserInfo).toEqual({ firstName: 'Admin', lastName: 'User' });
    });

    it('returns empty object when no login as user info is set', () => {
      expect(accountStorage.loginAsUserInfo).toEqual({});
    });
  });

  describe('latestCommitSHA', () => {
    it('sets and gets latest commit SHA', () => {
      accountStorage.setLatestCommitSHA('abc123def456');
      expect(accountStorage.latestCommitSHA).toBe('abc123def456');
    });

    it('returns null when no SHA is set', () => {
      expect(accountStorage.latestCommitSHA).toBeNull();
    });
  });

  describe('closeAfterSignedIn', () => {
    it('sets and gets closeAfterSignedIn flag', () => {
      accountStorage.setCloseAfterSignedIn();
      expect(accountStorage.closeAfterSignedIn).toBe(true);
    });

    it('returns false when flag is not set', () => {
      expect(accountStorage.closeAfterSignedIn).toBe(false);
    });

    it('removes closeAfterSignedIn flag with rmCloseAfterSignedIn', () => {
      accountStorage.setCloseAfterSignedIn();
      expect(accountStorage.closeAfterSignedIn).toBe(true);

      accountStorage.rmCloseAfterSignedIn();
      expect(accountStorage.closeAfterSignedIn).toBe(false);
    });
  });

  describe('remove', () => {
    it('removes item from localStorage by key', () => {
      localStorage.setItem('testKey', 'testValue');
      expect(localStorage.getItem('testKey')).toBe('testValue');

      accountStorage.remove('testKey');
      expect(localStorage.getItem('testKey')).toBeNull();
    });

    it('can remove auth token using the key', () => {
      accountStorage.setAuthToken('token123');
      expect(accountStorage.authToken).toBe('token123');

      accountStorage.remove(accountStorage.AUTH_TOKEN_KEY);
      expect(accountStorage.authToken).toBeNull();
    });
  });

  describe('storage keys', () => {
    it('has correct key constants', () => {
      expect(accountStorage.AUTH_TOKEN_KEY).toBe('authToken');
      expect(accountStorage.USER_INFO_KEY).toBe('userInfo');
      expect(accountStorage.LOGIN_AS_USER_INFO_KEY).toBe('loginAsUserInfo');
      expect(accountStorage.LATEST_COMMIT_SHA_KEY).toBe('latest-sha');
      expect(accountStorage.CLOSE_AFTER_SIGNED_IN_KEY).toBe('close-after-signed-in');
    });
  });
});
