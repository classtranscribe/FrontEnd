import { Auth } from './Auth'

const auth = new Auth();
// a user have an id, firstName, lastName and email
export const user = {
  id: () => { 
    if (localStorage.getItem('userID') !== null) {
      return localStorage.getItem('userID')
    } else {
      // do a GET request here
      // and save the userID into the localStorage
    }
  },
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
  saveUser: () => {
    // const user = {
    //   firstName: this.firstName,
    //   lastName: this.lastName,
    //   email: this.email,
    // }
    // do a POST request here with userID
  }
}