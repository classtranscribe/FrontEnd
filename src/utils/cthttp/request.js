import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { env } from 'utils/env';
import { links, uurl } from 'utils';
import { accountStorage } from 'utils/user/storage';

const DEFAULT_LOG_TIMEOUT = 120000;
class CTHTTPRequest {
  /**
   * Create an axios instance with ClassTranscribe authorization
   * @param {Boolean} withAuth true if send request with authorization
   * @returns {AxiosInstance} the axios instance with ClassTranscribe authorization
   */
  request(withAuth = true) {
    let authToken = accountStorage.authToken;
    let loginAsAuthToken = accountStorage.loginAsUserInfo.authToken;
    if (!uurl.isEqual(links.admin()) && loginAsAuthToken) {
      authToken = loginAsAuthToken;
    }

    return axios.create({
      baseURL: env.baseURL || window.location.origin,
      timeout: DEFAULT_LOG_TIMEOUT,
      headers: {
        Authorization:
          authToken && withAuth
            ? `Bearer ${authToken}`
            : undefined,
      },
    });
  }

  /**
   * HTTP request GET
   * @param {string} pathname
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  get(pathname, config = {}) {
    return this.request().get(`/api/${pathname}`, config);
  }

  /**
   * HTTP request POST
   * @param {string} pathname
   * @param {Object} data
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  post(pathname, data, config = {}) {
    return this.request().post(`/api/${pathname}`, data, config);
  }

  /**
   * HTTP request PUT
   * @param {string} pathname
   * @param {Object} data
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  put(pathname, data, config = {}) {
    return this.request().put(`/api/${pathname}`, data, config);
  }

  /**
   * HTTP request Delete
   * @param {string} pathname
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(pathname, config = {}) {
    return this.request().delete(`/api/${pathname}`, config);
  }
}

export const cthttp = new CTHTTPRequest();
