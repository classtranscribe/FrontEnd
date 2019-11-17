import _ from 'lodash'
import { transControl } from "./trans.control"
import { ARRAY_EMPTY, ARRAY_INIT } from "./constants.util"

/**
 * Functions for controlling user preference
 */

export const searchControl = {
  search_: [],
  setSearch: function() {}, 

  init: function(setSearch) {
    this.setSearch = setSearch
  },

  openSearch: function() {
    this.setSearch(ARRAY_INIT)
    this.search_ = ARRAY_INIT
  },

  closeSearch: function() {
    this.setSearch(null)
    this.search_ = null
  },

  handleOpen: function(bool) {
    if (bool === undefined) {
      if (this.search_ === null) this.openSearch()
      else this.closeSearch()
    } else {
      if (Boolean(bool)) this.openSearch()
      else this.closeSearch()
    }
  },

  search: function(value) {
    if (value === undefined) return this.search_
    let captions = transControl.captions()
    if (!value) {
      return this.openSearch()
    }
    let tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      let re = new RegExp(_.escapeRegExp(word), 'i')
      let test = result => re.test(result.text)
      tests.push(test)
    })
    // combine the test result
    let isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    let results = _.filter(captions, isMatch)
    if (results.length === 0) results = ARRAY_EMPTY

    this.setSearch(results)
    this.search_ = results
  },
}