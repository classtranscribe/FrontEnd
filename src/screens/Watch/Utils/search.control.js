import _ from 'lodash'
import { transControl } from "./trans.control"
import { SEARCH_INIT, ARRAY_EMPTY, ARRAY_INIT, SEARCH_HIDE, SEARCH_BEGIN, SEARCH_RESULT, SEARCH_TRANS_IN_VIDEO } from "./constants.util"

/**
 * Functions for controlling user preference
 */

export const searchControl = {
  search_: SEARCH_INIT,
  setSearch: function() {}, 

  init: function(setSearch) {
    this.setSearch = setSearch
  },

  openSearch: function(option=SEARCH_TRANS_IN_VIDEO) {
    let search = { ...this.search_, option, status: SEARCH_BEGIN }
    this.setSearch(search)
    this.search_ = search
  },

  closeSearch: function() {
    if (this.search_.status === SEARCH_HIDE) return;
    let search = { ...this.search_, status: SEARCH_HIDE }
    this.setSearch(search)
    this.search_ = search
  },

  handleOpen: function(bool) {
    if (bool === undefined) {
      if (this.search_.status === SEARCH_HIDE) this.openSearch()
      else this.closeSearch()
    } else {
      if (Boolean(bool)) this.openSearch()
      else this.closeSearch()
    }
  },

  getInVideoTransSearchResult: function(value) {
    if (value === undefined) return this.search_
    let captions = transControl.transcript()
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

    let search = { ...this.search_, status: SEARCH_RESULT, results, value }
    // console.log('results', results)
    this.setSearch(search)
    this.search_ = search
  },
}