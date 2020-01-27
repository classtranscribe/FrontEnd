/**
 * Functions for searching
 */

import _ from 'lodash'
import { searchInOfferings } from './search.offerings'

export const search = {
  searchInOfferings: searchInOfferings,
  
  getInstructorResult: function(instructors, value) {
    if (!value) return instructors
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.firstName) || re.test(result.lastName) || re.test(result.email)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    return _.filter(instructors, isMatch)
  },

  generalSearch: function(array, value, key) {
    if (!value) return array
    const re = new RegExp(_.escapeRegExp(value), 'i')
    const isMatch = word => re.test(key ? word[key] : word)
    return _.filter(array, isMatch)
  },

  getRegExpTests: function(value='', keys=[], parser=item => item) {
    let tests = []
    // get test functions for each word
    value.split(' ').forEach(word => {
      let reg = new RegExp(_.escapeRegExp(word), 'gi')

      const testFunc = result => {
        let re = false
        _.forEach(keys, key => {
          re = re || reg.test(_.get(parser(result), key))
        })
        return re
      }
      tests.push({ word, testFunc, reg })
    })

    return tests
  },

  getMatchFunction: function(value='', keys=[], parser) {
    let tests = this.getRegExpTests(value, keys, parser)
    // combine the test result
    const isMatch = result => {
      let match = true
      tests.forEach( test => match = match && test.testFunc(result))
      return match
    }

    return isMatch
  },
}