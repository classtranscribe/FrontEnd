import b2cauth from 'react-azure-adb2c';
import decodeJWT from 'jwt-decode'; 

export const auth = {
  isLoggedIn: function() {
    if (b2cauth.getAccessToken()) return true;
    return false;
  },

  logout: function() {
    b2cauth.signOut();
  },

  getToken: function() {
    return b2cauth.getAccessToken();
  },

  currentUser: function() {
    // console.log(b2cauth.getAccessToken());
    const decoded = decodeJWT(b2cauth.getAccessToken());
    return {
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      emails: decoded.emails
    };
  },
}