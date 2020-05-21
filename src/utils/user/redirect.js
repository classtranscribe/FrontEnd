export default {
  REDIRECT_URI_KEY: 'redirect_uri',

  saveRedirectURI(redirect_uri = window.location.href) {
    localStorage.setItem(this.REDIRECT_URI_KEY, redirect_uri);
  },

  getRedirectURI() {
    return localStorage.getItem(this.REDIRECT_URI_KEY) || window.location.origin;
  },

  clear() {
    localStorage.removeItem(this.REDIRECT_URI_KEY);
  },
};
