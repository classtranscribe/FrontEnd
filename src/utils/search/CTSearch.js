import _ from 'lodash'

export class CTSearch {
  /**
   * Get the tests for the each word in the value
   * @param {string} value searched value
   * @param {[string]|string} keys the keys for the 
   * @param {Object} options the options for getRegExpTests
   * @param {string} options.flags the flags of RegExp
   * 
   * @returns {[Function]}
   */
  getRegExpTests(value='', keys, options={ flags: 'gi' }) {
    let { flags } = options
    let tests = []
    if (typeof keys === 'string') {
      keys = [keys]
    }
    // get test functions for each word
    let testFunc = null

    value.split(' ').forEach(word => {
      let reg = new RegExp(_.escapeRegExp(word), flags)

      if (!keys) { // if the item itself is a string
        testFunc = item => reg.test(item)
      } else { // if the item is an object
        testFunc = item => {
          let re = false
          _.forEach(keys, key => {
            re = re || reg.test(_.get(item, key))
          })
          return re
        }
      }

      tests.push({ word, testFunc, reg })
    })

    return tests
  }

  /**
   * Get the isMatch function
   * @param {string} value searched value
   * @param {[string]} keys the keys for the 
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
  getMatchFunction (value='', keys, options={ flags: 'gi' }) {
    let tests = this.getRegExpTests(value, keys, options)
    // combine the test item
    const isMatch = item => {
      let match = true
      tests.forEach( test => match = match && test.testFunc(item))
      return match
    }

    return isMatch
  }

  /**
   * Get the results of a search
   * @param {[Object]} items the array of items to search in
   * @param {string} value searched value
   * @param {[string]} keys the keys for the 
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
  getResults (items=[], value='', keys, options={ flags: 'gi' }) {
    let isMatch = this.getMatchFunction(value, keys, options)
    return _.filter(items, isMatch)
  }
}