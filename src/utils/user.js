/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import { api } from './HTTP'
import { storage } from './storage'
import auth0Client from './auth0'
import decoder from 'jwt-decode'

export const user = {
  login: function() {
    auth0Client.signIn()
  },
  isLoggedIn: () => Boolean(localStorage.getItem('userId')),
  saveUserInfo: function (userInfo) {
    const profile = auth0Client.getProfile()
    const tokenInfo = decoder(userInfo.authToken)
    localStorage.setItem('userInfo', JSON.stringify({
      ...userInfo, 
      roles: tokenInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
      firstName: profile.given_name,
      lastName: profile.family_name,
      fullName: profile.name,
      picture: profile.picture
    }))
  },
  getUserInfo: function () {
    let userInfoStr = localStorage.getItem('userInfo')
    // console.log(JSON.parse(userInfoStr))
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  },
  isAdmin: function () {
    const { roles } = this.getUserInfo()
    return roles && roles.includes('Admin')
  },
  isInstructor: function () {
    const { roles } = this.getUserInfo()
    return roles && roles.includes('Instructor')
  },
  setUpUser: async function () {
    if (this.userId() === null) {
      await auth0Client.handleAuthentication()
      const { data } = await api.getAuthToken(auth0Client.getAuth0Token()).catch(error => console.log(error))
      // console.log(auth0Client.getAuth0Token())
      // Save UserId
      localStorage.setItem('userId', data.userId)
      // Save AuthToken
      api.saveAuthToken(data.authToken)
      // Save userInfo
      this.saveUserInfo(data)
      // Save onboard data in user metadata
      await storage.initOnboardLocally()
      // redirect
      var redirectURL = auth0Client.getRedirectURL()
      const tokenInfo = decoder(data.authToken)
      const roles = tokenInfo['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
      if (redirectURL === '/home' && roles && roles.includes('Admin')) redirectURL = '/Admin'
      else if (redirectURL === '/home' && roles && roles.includes('Instructor')) redirectURL = '/Instructor'
      window.location = redirectURL
      window.history.pushState({ state: auth0Client.getRedirectState() }, null, redirectURL)

    } else {
      // console.log(this.getUserInfo())
      window.location = auth0Client.getRedirectURL()
    }
  },

  userId: () => localStorage.getItem('userId'),
  
  signout: function () { 
    // remove possible localStorage
    localStorage.clear()
    auth0Client.signOut()
  },
}