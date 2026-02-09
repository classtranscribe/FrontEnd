// Mock cthttp
import {
  accountSignIn,
  testSignIn,
  loginAsAccountSignIn,
  getUserMetaData,
  postUserMetaData,
} from './Account';
import { cthttp } from '../request';

jest.mock('../request', () => ({
  cthttp: {
    get: jest.fn().mockResolvedValue({ data: {} }),
    post: jest.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Account API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SignIn methods', () => {
    it('accountSignIn calls POST Account/SignIn with data', async () => {
      await accountSignIn('token123', 'Auth0', 'http://callback.url');
      expect(cthttp.post).toHaveBeenCalledWith('Account/SignIn', {
        token: 'token123',
        authMethod: 'Auth0',
        callbackURL: 'http://callback.url',
      });
    });

    it('testSignIn calls GET Account/TestSignIn', async () => {
      await testSignIn();
      expect(cthttp.get).toHaveBeenCalledWith('Account/TestSignIn');
    });

    it('loginAsAccountSignIn calls POST Account/LoginAs with emailId', async () => {
      await loginAsAccountSignIn('user@example.com');
      expect(cthttp.post).toHaveBeenCalledWith('Account/LoginAs', {
        emailId: 'user@example.com',
      });
    });
  });

  describe('User Metadata methods', () => {
    it('getUserMetaData calls GET Account/GetUserMetadata/GetUserMetadata', async () => {
      await getUserMetaData();
      expect(cthttp.get).toHaveBeenCalledWith('Account/GetUserMetadata/GetUserMetadata');
    });

    it('postUserMetaData calls POST Account/PostUserMetadata/PostUserMetadata with data', async () => {
      const metadata = { preferences: { theme: 'dark' } };
      await postUserMetaData(metadata);
      expect(cthttp.post).toHaveBeenCalledWith('Account/PostUserMetadata/PostUserMetadata', metadata);
    });
  });
});
