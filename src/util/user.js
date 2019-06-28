import { auth } from './Auth'
import { api } from './http'

// a user have an id, firstName, lastName and email
export const user = {
  isLoggedIn: () => auth.isLoggedIn(),
  b2cToken: () => auth.getToken(),
  setUpUser: function (callback) {
    if (this.id() === null) {
      api.getAuthToken()
      .then(response => {
        console.log(response.data)
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
  id: () => localStorage.getItem('userId'),


  lastName: () => {
    return auth.currentUser().lastName
  },
  firstName: () => {
    return auth.currentUser().firstName
  },
  fullName: () => {
    return auth.currentUser().firstName + ' ' + auth.currentUser().lastName
  },
  email: () => {
    return auth.currentUser().emails[0]
  },
  signout: function () { 
    ['authToken', 'userId'].forEach( key => {
      localStorage.removeItem(key);
    })
    auth.logout();
  }
}