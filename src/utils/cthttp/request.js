import axios from 'axios';
import { env } from 'utils/env';
import { Agent } from 'https'
import { links, uurl } from 'utils';
import { accountStorage } from 'utils/user/storage';

const DEFAULT_LOG_TIMEOUT = 120000;

const corsheaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
  };

class CTHTTPRequest {
  /**
   * Create an axios instance with ClassTranscribe authorization
   * @param {Boolean} withAuth true if send request with authorization
   * @returns {AxiosInstance} the axios instance with ClassTranscribe authorization
   */
  request(withAuth = true,timeout = DEFAULT_LOG_TIMEOUT) {
    let authToken = accountStorage.authToken;
    let loginAsAuthToken = accountStorage.loginAsUserInfo.authToken;
    if (!uurl.isEqual(links.admin()) && loginAsAuthToken) {
      authToken = loginAsAuthToken;
    }
    // eslint-disable-next-line no-console
    console.log("env.baseURL:",env.baseURL);
    const baseURL = env.baseURL || window.location.origin;
    const beSecure = ! baseURL.startsWith("https://localhost");
    // For Chrome Testing: open the API in the browser (e.g. https://localhost:8443/api/Universities ) and accept as unsafe

    const httpsAgent = new Agent({
        rejectUnauthorized: beSecure,
        requestCert: beSecure,
        // agent: beSecure
     });
    const Authorization = (authToken && withAuth) ? `Bearer ${authToken}` : undefined;
    return axios.create({
      baseURL,
      timeout,
      withCredentials: false, // dont send session cookies (which we don't use anyway)
      httpsAgent,
      httpAgent: httpsAgent,
      headers: { ...corsheaders, Authorization},
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
