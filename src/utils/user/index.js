/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import _ from 'lodash'
import decoder from 'jwt-decode'
import auth0Client from './auth0'
import { api } from '../HTTP'
import { util } from '../index'

export { userAction } from './useraction'

// keys to localStorage
export const TOKEN_INFO_KEY = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
export const USER_INFO_KEY = 'userInfo'
export const AUTH_TOKEN_KEY = 'authToken'
export const TEST_USER_INFO_KEY = 'testUserInfo'
// Possible roles of a user
export const ROLE_ADMIN = 'Admin'
export const ROLE_INST = 'Instructor'


export class CTUser {
  /**
   * @returns {Object} userInfo: 
   * - { firstName, lastName, fullName, picture, roles, exp, userId, emailId, universityId, authToken, metadata }
   */
  getUserInfo () {
    let userInfoStr = localStorage.getItem(USER_INFO_KEY)
    // console.log(JSON.parse(userInfoStr))
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  }

  /**
   * @returns {String} UserId
   */
  userId() {

    if (window.location.pathname === '/admin') { // if it's in admin page
      return this.getUserInfo().userId
    }

    return this.getTestUserInfo().userId || this.getUserInfo().userId
  }

  set authToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }

  get authToken() {

    if (window.location.pathname === '/admin') { // if it's in admin page
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }

    return this.getTestUserInfo().authToken || localStorage.getItem(AUTH_TOKEN_KEY)
  }

  /**
   * @returns {Boolean} isLoggedIn
   */
  isLoggedIn() {
    return Boolean(this.userId())
  }

  isAdmin (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_ADMIN)
  }

  isInstructor (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_INST)
  }


  // Actions
  login() {
    auth0Client.signIn()
  }

  reLogin() {
    localStorage.clear()
    this.login()
  }

  signout () { 
    // remove possible localStorage
    localStorage.clear()
    auth0Client.signOut()
  }
  
  saveUserInfo (userInfo) {
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
  }

  async setUpUser () {
    if (!this.isLoggedIn()) {
      await auth0Client.handleAuthentication()
      const { data } = await api.accountSignIn(auth0Client.getAuth0Token())
      let { authToken } = data
      // Save AuthToken
      this.authToken = authToken
      // Save userInfo
      this.saveUserInfo(data)

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
    } else {
      window.location = auth0Client.getRedirectURL()
    }
  }

  checkExpiration () {
    let { exp } = this.getUserInfo()
    if (!Boolean(exp)) return;
    if (exp > new Date()) { // if authToken expired relogin the user
      this.reLogin()
    }
  }

  isTestAccount() {
    return Boolean(this.getTestUserInfo().emailId)
  }

  getTestUserInfo() {
    // return {}
    let dataStr = localStorage.getItem(TEST_USER_INFO_KEY)
    return dataStr ? JSON.parse(dataStr) : {}
  }

  async testAccountSignIn (emailId, password) {
    try {
      const { data } = await api.testAccountSignIn(emailId, password)
      localStorage.setItem(TEST_USER_INFO_KEY, JSON.stringify(data))
      window.location.reload()
      // console.log(data)
    } catch (error) {
      console.error('Failed to sign in as ' + emailId)
    }
  }

  testAccountSignOut () {
    localStorage.removeItem(TEST_USER_INFO_KEY)
    window.location.reload()
  }

}

export const user = new CTUser()