/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import _ from 'lodash'
import decoder from 'jwt-decode'
import auth0Client from './auth0'
import { api } from '../HTTP'
import { util } from '../index'

// keys to localStorage
export const TOKEN_INFO_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
export const USER_INFO_KEY = 'userInfo'
// Possible roles of a user
export const ROLE_ADMIN = 'Admin'
export const ROLE_INST = 'Instructor'

export const user = {
  // Info
  /**
   * @returns {String} UserId
   */
  userId: function() {
    return this.getUserInfo().userId
  },

  /**
   * @returns {Boolean} isLoggedIn
   */
  isLoggedIn: function() {
    return Boolean(this.userId())
  },

  /**
   * @returns {Object} userInfo: 
   * - { firstName, lastName, fullName, picture, roles, exp, userId, emailId, universityId, authToken, metadata }
   */
  getUserInfo: function () {
    let userInfoStr = localStorage.getItem(USER_INFO_KEY)
    // console.log(JSON.parse(userInfoStr))
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  },

  isAdmin: function (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_ADMIN)
  },

  isInstructor: function (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_INST)
  },


  // Actions
  login: function() {
    auth0Client.signIn()
  },

  reLogin: function() {
    localStorage.clear()
    this.login()
  },

  signout: function () { 
    // remove possible localStorage
    localStorage.clear()
    auth0Client.signOut()
  },
  
  saveUserInfo: function (userInfo) {
    // info from JWT token
    const tokenInfo = decoder(userInfo.authToken)
    let exp = new Date(tokenInfo.exp * 1000) // expiration date
    // info from auth0
    const { given_name, family_name, name, picture } = auth0Client.getProfile()
    // info from CT backend
    let { emailId, universityId, userId } = userInfo
    // store userInfo in localStorage
    localStorage.setItem(USER_INFO_KEY, JSON.stringify({
      emailId, universityId, userId, exp, picture,
      roles: tokenInfo[TOKEN_INFO_KEY],
      firstName: given_name,
      lastName: family_name,
      fullName: name,
    }))
  },

  setUpUser: async function () {
    if (!this.isLoggedIn()) {
      await auth0Client.handleAuthentication()
      const { data } = await api.getAuthToken(auth0Client.getAuth0Token())
      let { authToken } = data
      // Save AuthToken
      api.saveAuthToken(authToken)
      // Save userInfo
      this.saveUserInfo(data)
      // Save onboard data in user metadata
      // await storage.initOnboardLocally()

      // Redirect
      var redirectURL = auth0Client.getRedirectURL() // default redirect url
      const tokenInfo = decoder(authToken)
      const roles = tokenInfo[TOKEN_INFO_KEY]
      // redirect admins and instructors to their page
      if (redirectURL === util.links.home() && roles) {
        if (this.isAdmin(roles)) {
          redirectURL = util.links.admin()
        }
        else if (this.isInstructor(roles)) {
          redirectURL = util.links.instructor()
        }
      }

      window.location = redirectURL
      // window.history.pushState(
      //   { state: auth0Client.getRedirectState() }, 
      //   document.title, 
      //   redirectURL
      // )
    } else {
      window.location = auth0Client.getRedirectURL()
    }
  },

  checkExpiration: function() {
    let { exp } = this.getUserInfo()
    if (!Boolean(exp)) return;
    if (exp > new Date()) { // if authToken expired relogin the user
      this.reLogin()
    }
  },

}