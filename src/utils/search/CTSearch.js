import _ from 'lodash';

export class CTSearch {
  /**
   * Get the tests for the each word in the value
   * @param {string} value - searched value
   * @param {[string]|string} keys - the attrs for the
   * @param {Object} options - the options for getRegExpTests
   * @param {string} options.flags - the flags of RegExp
   *
   * @returns {[Function]}
   */
  static getRegExpTests(value = '', keys, options = { flags: 'gi' }) {
    const { flags } = options;
    const tests = [];
    let attrs = keys;
    if (typeof attrs === 'string') {
      attrs = [attrs];
    }
    // get test functions for each word
    let testFunc = null;

    value.split(' ').forEach((word) => {
      const reg = new RegExp(_.escapeRegExp(word), flags);

      if (!attrs) {
        // if the item itself is a string
        testFunc = (item) => {
          if (typeof item === 'string') {
            const itemStr = item.toLowerCase();
            return reg.test(itemStr);
          }

          return false;
        };
      } else {
        // if the item is an object
        testFunc = (item) => {
          let re = false;
          _.forEach(attrs, (key) => {
            let text = _.get(item, key);
            if (typeof text === 'string') {
              text = text.toLowerCase();
              re = re || reg.test(text);
            }
          });

          return re;
        };
      }

      tests.push({ word, testFunc, reg });
    });

    return tests;
  }

  /**
   * Get the isMatch function
   * @param {string} value searched value
   * @param {[string]|string} attrs the attrs for the
   * @param {Object} options the options for getRegExpTests
   * @param {string} options.flags the flags of RegExp
   *
   * @property options.flags default 'gi'
   *
   * @example
   * ```
   * let value = ...
   * let isMatch = search.getMatchFunction(value, ['title', 'author'], {flags: 'i'})
   * let results = books.filter(isMatch)
   * ```
   *
   * @returns {Function}
   */
  static getMatchFunction(value = '', attrs, options = { flags: 'gi' }) {
    const tests = this.getRegExpTests(value, attrs, options);
    // combine the test item
    const isMatch = (item) => {
      let match = true;
      tests.forEach((test) => (match = match && test.testFunc(item)));
      return match;
    };

    return isMatch;
  }

  /**
   * Get the results of a search
   * @param {[Object]} items the array of items to search in
   * @param {string} value searched value
   * @param {[string]|string} attrs the attrs for the
   * @param {Object} options the options for getRegExpTests
   * @param {string} options.flags the flags of RegExp
   *
   * @example
   * ```
   * let value = ...
   * let books = [{title, author} ...]
   * let results = search.getResults(books, value, ['title', 'author'], {flags: 'i'})
   * ```
   */
  static getResults(items = [], value = '', attrs, options = { flags: 'gi' }) {
    const isMatch = this.getMatchFunction(value, attrs, options);
    return _.filter(items, isMatch);
  }
}
