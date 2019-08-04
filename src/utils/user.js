/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 * (like a interface for user based on api and auth)
 */

import { auth } from './Auth'
import { api } from './http'

export const user = {
  login: function() {
    window.location = `/login?${window.location.pathname}`
  },
  isLoggedIn: () => localStorage.getItem('userInfo'),
  b2cToken: () => auth.getToken(),
  saveUserInfo: function (userInfo) {
    localStorage.setItem('userInfo', JSON.stringify({
      ...userInfo, 
      firstName: this.firstName(),
      lastName: this.lastName(),
      fullName: this.fullName()
    }))
  },
  getUserInfo: function () {
    let userInfoStr = localStorage.getItem('userInfo')
    return userInfoStr ? JSON.parse(userInfoStr) : {}
  },
  setUpUser: function (callback) {
    if (this.id() === null) {
      api.getAuthToken()
        .then(({data}) => {
          console.log(data)
          localStorage.setItem('userId', data.userId)
          api.saveAuthToken(data.authToken)
          this.saveUserInfo(data)
          if (callback) callback(data.userId)
        })
        .catch(error => {
          console.log(error)
        })
    } else {
      // console.log(this.getUserInfo())
      if (callback) callback(this.id())
    }
  },

  /**
   * Functions for getting user's basic info
   */
  id: () => localStorage.getItem('userId'),
  lastName: function () {
    return auth.currentUser().lastName
  },
  firstName: function () {
    return auth.currentUser().firstName
  },
  fullName: function () {
    return auth.currentUser().firstName + ' ' + auth.currentUser().lastName
  },
  email: function () {
    return auth.currentUser().emails[0]
  },

  /**
   * Function for signing out and clearing the localStorage
   */
  signout: function () { 
    // remove possible localStorage
    [
      'activePane', 'offeringActivePane', 'courseActivePane',
      'termCurrUni', 'departCurrUni', 'courseCurrUni', 
      'courseCurrDepart', 'searchValue',
      'authToken', 'userId', 'userInfo'
    ].forEach( key => {
      localStorage.removeItem(key)
    });
    window.location = '/logout'
  },
  logout: () => auth.logout()
}