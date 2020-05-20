/**
 * The parent class used to store user preference into localStorage
 */
export class CTPreference {
  constructor() {
    this.TRUE = 'true';
    this.FALSE = 'false';
  }

  init() {}

  /**
   * Function used to set and get item from localStorage
   * @param {String} key The key to the localStorage value
   * @param {Boolean} bool The value to set
   * @param {Boolean} setfalse if true and bool is false,
   *   set the value to be 'false' instead of removing from localStorage
   * @returns {string} the value stored in localStorage if no bool provided
   */
  localStorage(key, bool, setfalse = false) {
    if (bool === undefined) return this[key];
    this[key] = Boolean(bool);
    if (bool) {
      localStorage.setItem(key, this.TRUE);
    } else if (setfalse) {
      localStorage.setItem(key, this.FALSE);
    } else {
      localStorage.removeItem(key);
    }
  }

  /**
   * Function used to determine if an elem in localStorage is true
   * @param {String} key The key to the localStorage value
   * @returns {Boolean} if an elem in localStorage is true
   */
  isTrue(key) {
    return localStorage.getItem(key) === this.TRUE;
  }

  /**
   * Function used to determine if an elem in localStorage is false
   * @param {String} key The key to the localStorage value
   * @returns {Boolean} if an elem in localStorage is false
   */
  isFalse(key) {
    return localStorage.getItem(key) === this.FALSE;
  }
}
