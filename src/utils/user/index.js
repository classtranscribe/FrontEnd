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
export const LATEST_COMMIT_SHA_KEY = 'latest-sha'
// Possible roles of a user
export const ROLE_ADMIN = 'Admin'
export const ROLE_INST = 'Instructor'


export class CTUser {
  constructor() {}

  // ---------------------------------------------------------------------------
  // Sign in/out actions
  // ---------------------------------------------------------------------------

  // Login the user
  login() {
    auth0Client.signIn()
  }

  // login the user and clear the localStorage
  reLogin() {
    localStorage.clear()
    this.login()
  }

  // logout the user
  signout () { 
    // remove possible localStorage
    localStorage.clear()
    auth0Client.signOut()
  }

  // Setup the user after being logged in
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


  // ---------------------------------------------------------------------------
  // User validation handlers
  // ---------------------------------------------------------------------------

  // check if a user is valid
  async validate() {
    await this.checkGitUpdates()
    if (!this.isLoggedIn()) return;
    await this.checkExpiration()
    // api.contentLoaded()
    return true
  }

  // check if the auth token is valid
  async checkExpiration() {
    let { exp } = this.getUserInfo()
    if (!Boolean(exp)) return

    exp = new Date(exp)

    // if authToken expired relogin the user
    if (exp < new Date()) {
      this.reLogin()
    }
  }

  // check if the there is a new commit to master
  async checkGitUpdates() {
    let latestSHA = await api.getLatestGitCommitSHA()
    let localSHA = localStorage.getItem(LATEST_COMMIT_SHA_KEY)
    // if it's a first time user, store the latest commit SHA
    if (!localSHA && !this.isLoggedIn()) {
      localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA)
    }
    // if there is a new commit, forcely reload the page from server
    else if (!localSHA || localSHA !== latestSHA) {
      localStorage.setItem(LATEST_COMMIT_SHA_KEY, latestSHA)
      window.location.reload(true)
    }
  }


  // ---------------------------------------------------------------------------
  // User info handlers
  // ---------------------------------------------------------------------------

  /**
   * Function used to save user info to localStorage
   * @param {Object} userInfo 
   */
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

  /**
   * @returns {Object} userInfo: 
   * - { 
   *      firstName, lastName, fullName, picture, roles, exp, 
   *      userId, emailId, universityId, authToken, metadata 
   *   }
   */
  getUserInfo (options={ allowTestUserOverride: false }) {
    
    // if allow the user info be overrided by the test user
    if (options.allowTestUserOverride && this.isTestAccount()) {
      return this.getTestUserInfo()
    }

    let userInfoStr = localStorage.getItem(USER_INFO_KEY)
    // console.log(JSON.parse(userInfoStr))
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  }

  // returns the id of the user, or test id if it exists
  userId() {

    if (window.location.pathname === '/admin') { // if it's in admin page
      return this.getUserInfo().userId
    }

    return this.getTestUserInfo().userId || this.getUserInfo().userId
  }

  // set the authorization token
  set authToken(token) {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  }

  // return the authorization token
  get authToken() {
    if (window.location.pathname === '/admin') { // if it's in admin page
      return localStorage.getItem(AUTH_TOKEN_KEY)
    }

    return this.getTestUserInfo().authToken || localStorage.getItem(AUTH_TOKEN_KEY)
  }

  // return true if the user is logged in
  isLoggedIn() {
    return Boolean(this.userId())
  }

  // return true if the user is an admin
  isAdmin (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_ADMIN)
  }

  // return true if the user is an instructor
  isInstructor (roles) {
    if (roles === undefined) roles = this.getUserInfo().roles || []
    return _.includes(roles, ROLE_INST)
  }


  // ---------------------------------------------------------------------------
  // Admin - Login as another account - handlers
  // ---------------------------------------------------------------------------

  // return true if an admin is logged in as another account
  isTestAccount() {
    return Boolean(this.getTestUserInfo().emailId)
  }

  // return the testing user info if an admin is logged in as another account
  getTestUserInfo() {
    // return {}
    let dataStr = localStorage.getItem(TEST_USER_INFO_KEY)
    return dataStr ? JSON.parse(dataStr) : {}
  }

  // for admin to sign in as another account
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

  // logout the testing account for admin
  testAccountSignOut () {
    localStorage.removeItem(TEST_USER_INFO_KEY)
    window.location.reload()
  }

}

export const user = new CTUser()