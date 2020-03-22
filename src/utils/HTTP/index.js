import axios from 'axios'
import { httpGET    } from './http.get'
import { httpPOST   } from './http.post'
import { httpPUT    } from './http.put'
import { httpDELETE } from './http.delete'
import { responseParsers    } from './helper.response-parsers'
import { userMetadataHelper } from './helper.user-metadata'

import { isDeveloping } from '../constants'
import { env } from '../env'
import { user } from '../user'

/**
 * Set up http
 */
export const http = axios.create({
  baseURL: env.baseURL || window.location.origin,
  timeout: 100000,
})


/**
 * api 
 * - Object for http requests from backend
 */
export const api = {
  initialData: require('../json/initialData.json'),
  offeringAccessType: require('../json/offeringAccessTypes.json'),
  playlistTypes: require('../json/playlistTypes.json'),

  /**
   * Function called when all the requests executed
   * then hide the loading page
   */
  baseUrl: () => env.baseURL || window.location.origin,
  getMediaFullPath: function(path) { // need to change later
    return `${this.baseUrl()}${path}`
  },
  
  contentLoaded: function (interval) {
    const ele = document.getElementById('ct-loading-wrapper')
    if(ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        if (ele.parentNode) ele.outerHTML = ''
        // ele.classList.add('hide')
      }, interval || 500)
    }
  },

  /**
   * Functions for set or get the auth/b2c token
   */

  accountSignIn: function(auth0Token) {
    return http.post(this.baseUrl() + '/api/Account/SignIn', { auth0Token })
  },

  testAccountSignIn: function() {
    return http.get(this.baseUrl() + '/api/Account/TestSignIn')
  },

  loginAsAccountSignIn: function(emailId) {
    // console.log(this.withAuth())
    return http.post(this.baseUrl() + '/api/Account/LoginAs', { emailId }, this.withAuth())
  },

  withAuth: function (configs={}) {
    return {
      ...configs,
      headers: {
        Authorization: 'Bearer ' + user.authToken
      }
    }
  },
  
  ...httpGET,
  ...httpPOST,
  ...httpPUT,
  ...httpDELETE,

  ...responseParsers,
  ...userMetadataHelper,
}