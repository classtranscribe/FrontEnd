import axios, { AxiosRequestConfig, AxiosInstance, AxiosResponse } from 'axios';
import { env } from '../../env';
import { user } from '../../user';

class CTHTTPRequest {
  /**
   * Create an axios instance with ClassTranscribe authorization
   * @param {Boolean} withAuth true if send request with authorization
   * @returns {AxiosInstance} the axios instance with ClassTranscribe authorization
   */
  request(withAuth = true) {
    return axios.create({
      baseURL: env.baseURL || window.location.origin,
      timeout: 20000,
      headers: {
        Authorization: user.authToken && withAuth ? `Bearer ${user.authToken}` : undefined,
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
   * HTTP request PUT
   * @param {string} pathname
   * @param {AxiosRequestConfig} config
   * @returns {Promise<AxiosResponse<any>>}
   */
  delete(pathname, config = {}) {
    return this.request().delete(`/api/${pathname}`, config);
  }
}

export const cthttp = new CTHTTPRequest();
