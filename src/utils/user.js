/**
 * The object for setting up user (get token & userId) 
 *  and get user information 
 * (like a interface for user based on api and auth)
 */

import { auth } from './Auth'
import { api } from './http'

export const user = {
  isLoggedIn: () => auth.isLoggedIn(),

  b2cToken: () => auth.getToken(),
  setUpUser: function (callback) {
    if (this.id() === null) {
      api.getAuthToken()
      .then(response => {
        console.log(response.data)
        console.log('b2cToken', api.b2cToken())
        localStorage.setItem('userId', response.data.userId)
        api.saveAuthToken(response);
        if (callback) callback(response.data.userId);
      })
      .catch(error => {
        console.log(error)
      })
    } else {
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
    // remove possible localStorage for admin page
    [
      'activePane', 'offeringActivePane', 'courseActivePane',
      'termCurrUni', 'departCurrUni', 'courseCurrUni', 
      'courseCurrDepart', 'searchValue', 'userId'
    ].forEach( key => {
      localStorage.removeItem(key);
    });
    // remove login info
    ['authToken', 'userId'].forEach( key => {
      localStorage.removeItem(key);
    });
    auth.logout();
  }
}