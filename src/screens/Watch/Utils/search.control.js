import _ from 'lodash'
import { api } from 'utils'
import { transControl } from "./trans.control"
import { 
  SEARCH_INIT, 
  ARRAY_INIT,
  ARRAY_EMPTY,
  SEARCH_HIDE, 
  SEARCH_BEGIN, 
  SEARCH_RESULT, 
  SEARCH_PAGE_NUM,
  SEARCH_TRANS_IN_VIDEO,
  SEARCH_TRANS_IN_COURSE,
  SEARCH_IN_PLAYLISTS
} from "./constants.util"

/**
 * Functions for controlling user preference
 */

export const searchControl = {
  search_: SEARCH_INIT,
  playlists: [],
  offeringId: '',
  // used to determine whether already has a result ot not
  hasResult: false,
  // Function used to set search state
  setSearch: function() {}, 

  // Function used to set up the external objects & functions used by searching
  init: function({setSearch, playlists, offeringId}) {
    if (setSearch) this.setSearch = setSearch
    if (playlists) this.playlists = playlists
    if (offeringId) this.offeringId = offeringId
  },

  // Function used to update `search` state
  updateSearch: function(search) {
    let newSearch = { ...this.search_, ...search }
    this.search_ = newSearch
    this.setSearch(newSearch)
  },

  // Function used to open search
  openSearch: function() {
    let status = this.hasResult ? SEARCH_RESULT : SEARCH_BEGIN 
    this.updateSearch({ status })
  },

  // Function used to close search
  closeSearch: function() {
    if (this.search_.status === SEARCH_HIDE) return;
    this.updateSearch({ status: SEARCH_HIDE })
  },

  // Function used to auto handle close or open search
  handleOpen: function(bool) {
    if (bool === undefined) {
      if (this.search_.status === SEARCH_HIDE) this.openSearch()
      else this.closeSearch()
    } else {
      if (Boolean(bool)) this.openSearch()
      else this.closeSearch()
    }
  },

  // Function used to reset search value & results
  resetResult: function() {
    this.updateSearch({ 
      inVideoTransResults: ARRAY_INIT, 
      inCourseTransResults: ARRAY_INIT,
      playlistResults: ARRAY_INIT,
      value: '', 
      status: SEARCH_BEGIN 
    })

    this.hasResult = false
  },

  /**
   * Functions for get search results
   */

  // Function used to get RegExp tests for provided value
  getRegExpTests: function(value='', key='text') {
    let tests = []
    // get test functions for each word
    value.split(' ').forEach(word => {
      let reg = new RegExp(_.escapeRegExp(word), 'gi')
      let testFunc = result => reg.test(_.get(result, key))
      tests.push({ word, testFunc, reg })
    })

    return tests
  },

  // Function used to get the match function 
  // which is used to determine whether an text is the result or not
  getMatchFunction: function(value='', key='text') {
    let tests = this.getRegExpTests(value, key)
    // combine the test result
    let isMatch = result => {
      let match = true
      tests.forEach( test => match = match && test.testFunc(result))
      return match
    }

    return isMatch
  },

  // Function used to add <span> tag around the searched value in a text
  highlightSearchedWords: function(results=[], value='', key='text') {
    let tests = this.getRegExpTests(value, key)
    return results.map( res => {
      let text = _.get(res, key).toLowerCase()
      tests.forEach( test => {
        if (test.testFunc(res)) {
          text = _.replace(text, test.reg, `<span>${test.word}</span>`)
        }
      })
      return _.set(_.clone(res), key, text)
    })
  },

  // Function used to get search results from captions in current video
  getInVideoTransSearchResults: function(value) {
    if (value === undefined) return this.search_
    let captions = transControl.transcript()
    if (!value) {
      return this.openSearch()
    }
    let isMatch = this.getMatchFunction(value, 'text')

    let inVideoTransResults = this.highlightSearchedWords(
      _.filter(captions, isMatch), 
      value
    )
    // if (inVideoTransResults.length === 0) inVideoTransResults = ARRAY_EMPTY

    return inVideoTransResults
  },

  // Function used to get search results from captions in current offering
  getInCourseTransSearchResults: async function(value) {
    if (!Boolean(this.offeringId)) return []
    const { data } = await api.searchCaptionInOffering(this.offeringId, value)
    let inCourseTransResults = this.highlightSearchedWords(data, value, 'caption.text')
    inCourseTransResults = inCourseTransResults.map( res => {
      const { caption, playlistId, mediaId } = res
      let playlist = _.find(this.playlists, { id: playlistId })
      let media = api.parseMedia(_.find(playlist.medias, { id: mediaId }))
      return {
        media, playlistName: playlist.name, ...caption
      }
    })
    // console.log('inCourseTransResults', inCourseTransResults)
    return inCourseTransResults
  },

  // Function used to get search results from videos in current offering
  getPlaylistResults: function(value) {
    let isMatch = this.getMatchFunction(value, 'mediaName')
    let playlistResults = []
    this.playlists.forEach( playlist => {
      let playlistName = playlist.name
      playlist.medias.forEach( media => {
        let media_ = api.parseMedia(media)
        if (isMatch(media_)) {
          playlistResults.push({
            playlistName, ...media_
          })
        }
      })
    })

    playlistResults = this.highlightSearchedWords(playlistResults, value, 'mediaName')
    // console.log('playlistResults', playlistResults)
    return playlistResults
  },

  // Function used to get search results from captions and videos
  getResults: async function(value) {
    if (!value) return this.resetResult()
    let inVideoTransResults = this.getInVideoTransSearchResults(value)
    let playlistResults = this.getPlaylistResults(value)
    this.updateSearch({ 
      status: SEARCH_RESULT, 
      inVideoTransResults, playlistResults, value,
      inCourseTransResults: ARRAY_INIT
    })
    let inCourseTransResults = await this.getInCourseTransSearchResults(value)
    this.updateSearch({ 
      inCourseTransResults 
    })
    this.hasResult = true
  },

  /**
   * Helper functions
   */

  // Function used to get the number of results
  resultNum: function(results) {
    if (results === ARRAY_INIT || results === ARRAY_EMPTY) return 0
    return results.length
  },

  // Function used to get the options for results
  getResultOptions: function(search=SEARCH_INIT, currOpt=SEARCH_TRANS_IN_VIDEO) {
    const { 
      inVideoTransResults=[], 
      inCourseTransResults=[], 
      playlistResults=[], 
    } = search

    const optNumMap = {
      [SEARCH_TRANS_IN_VIDEO]: [inVideoTransResults, 'caption', 'video'],
      [SEARCH_IN_PLAYLISTS]: [playlistResults, 'video', 'course'],
      [SEARCH_TRANS_IN_COURSE]: [inCourseTransResults, 'caption', 'course'],
    }

    return [
      SEARCH_TRANS_IN_VIDEO, SEARCH_IN_PLAYLISTS, SEARCH_TRANS_IN_COURSE
    ].map( opt => {
      let [res, name, range] = optNumMap[opt]
      let num = this.resultNum(res)
      let init = res === ARRAY_INIT
      return {
        opt, num, init,
        current: opt === currOpt,
        content: `${num >= 100 ? '99+' : num} ${name}${num > 1 ? 's' : ''} in this ${range}`
      }
    })
  },

  // Function used to get the total page num based on a result's length
  totalPageNum: function(resultLen=0) {
    return resultLen === 0 ? 1 : Math.ceil(resultLen / SEARCH_PAGE_NUM)
  },

  // Function used to determine whether an item is in current page
  isInCurrentPage: function(page=0, index=0) {
    return (index < page * SEARCH_PAGE_NUM) && (index >= (page-1)*SEARCH_PAGE_NUM)
  },

}