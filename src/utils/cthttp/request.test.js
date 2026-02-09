import axios from 'axios';
import { cthttp } from './request';

// Mock dependencies
jest.mock('axios');
jest.mock('utils/env', () => ({
  env: {
    baseURL: 'https://api.test.com',
  },
}));

jest.mock('utils', () => ({
  links: {
    admin: () => '/admin',
  },
  uurl: {
    isEqual: jest.fn(() => false),
  },
}));

jest.mock('utils/user/storage', () => ({
  accountStorage: {
    authToken: 'test-auth-token',
    loginAsUserInfo: {},
  },
}));

describe('CTHTTPRequest', () => {
  let mockAxiosInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    mockAxiosInstance = {
      get: jest.fn().mockResolvedValue({ data: {} }),
      post: jest.fn().mockResolvedValue({ data: {} }),
      put: jest.fn().mockResolvedValue({ data: {} }),
      delete: jest.fn().mockResolvedValue({ data: {} }),
    };
    axios.create.mockReturnValue(mockAxiosInstance);
  });

  describe('request', () => {
    it('creates axios instance with baseURL', () => {
      cthttp.request();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          baseURL: 'https://api.test.com',
        })
      );
    });

    it('includes Authorization header when withAuth is true', () => {
      cthttp.request(true);
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-auth-token',
          }),
        })
      );
    });

    it('omits Authorization header when withAuth is false', () => {
      cthttp.request(false);
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: undefined,
          }),
        })
      );
    });

    it('uses default timeout of 120000ms', () => {
      cthttp.request();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 120000,
        })
      );
    });

    it('accepts custom timeout', () => {
      cthttp.request(true, 60000);
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          timeout: 60000,
        })
      );
    });

    it('sets withCredentials to false', () => {
      cthttp.request();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          withCredentials: false,
        })
      );
    });

    it('includes CORS headers', () => {
      cthttp.request();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
          }),
        })
      );
    });

    it('includes httpsAgent configuration', () => {
      cthttp.request();
      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          httpsAgent: expect.any(Object),
          httpAgent: expect.any(Object),
        })
      );
    });

    it('uses loginAs auth token when available and not on admin page', () => {
      const { accountStorage } = require('utils/user/storage');
      const { uurl } = require('utils');

      accountStorage.loginAsUserInfo = { authToken: 'login-as-token' };
      uurl.isEqual.mockReturnValue(false);

      cthttp.request(true);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer login-as-token',
          }),
        })
      );

      // Reset
      accountStorage.loginAsUserInfo = {};
    });

    it('uses regular auth token on admin page even with loginAs token', () => {
      const { accountStorage } = require('utils/user/storage');
      const { uurl } = require('utils');

      accountStorage.loginAsUserInfo = { authToken: 'login-as-token' };
      uurl.isEqual.mockReturnValue(true);

      cthttp.request(true);

      expect(axios.create).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer test-auth-token',
          }),
        })
      );

      // Reset
      accountStorage.loginAsUserInfo = {};
      uurl.isEqual.mockReturnValue(false);
    });
  });

  describe('get', () => {
    it('calls request().get with /api/ prefix', async () => {
      await cthttp.get('Universities');
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/Universities', {});
    });

    it('passes config to axios', async () => {
      const config = { params: { id: '123' } };
      await cthttp.get('Users', config);
      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api/Users', config);
    });
  });

  describe('post', () => {
    it('calls request().post with /api/ prefix', async () => {
      const data = { name: 'Test' };
      await cthttp.post('Universities', data);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/Universities', data, {});
    });

    it('passes config to axios', async () => {
      const data = { name: 'Test' };
      const config = { headers: { 'Content-Type': 'application/json' } };
      await cthttp.post('Users', data, config);
      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api/Users', data, config);
    });
  });

  describe('put', () => {
    it('calls request().put with /api/ prefix', async () => {
      const data = { name: 'Updated' };
      await cthttp.put('Universities/123', data);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/Universities/123', data, {});
    });

    it('passes config to axios', async () => {
      const data = { name: 'Updated' };
      const config = { timeout: 5000 };
      await cthttp.put('Users/456', data, config);
      expect(mockAxiosInstance.put).toHaveBeenCalledWith('/api/Users/456', data, config);
    });
  });

  describe('delete', () => {
    it('calls request().delete with /api/ prefix', async () => {
      await cthttp.delete('Universities/123');
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/Universities/123', {});
    });

    it('passes config to axios', async () => {
      const config = { data: { reason: 'obsolete' } };
      await cthttp.delete('Users/456', config);
      expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api/Users/456', config);
    });
  });
});
