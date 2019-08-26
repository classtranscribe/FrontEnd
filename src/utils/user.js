/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 */

import { api } from './http'
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
  setUpUser: function (callback) {
    if (this.id() === null) {
      auth0Client.handleAuthentication().then(() => {
        api.getAuthToken(auth0Client.getAuth0Token())
          .then(({data}) => {
            console.log(data)
            localStorage.setItem('userId', data.userId)
            api.saveAuthToken(data.authToken)
            this.saveUserInfo(data)
            window.location = auth0Client.getRedirectURL()
          })
          .catch(error => {
            console.log(error)
          })
      })
    } else {
      console.log(this.getUserInfo())
      window.location = auth0Client.getRedirectURL()
    }
  },

  id: () => localStorage.getItem('userId'),
  
  signout: function () { 
    // remove possible localStorage
    localStorage.clear()
    auth0Client.signOut()
  },
}