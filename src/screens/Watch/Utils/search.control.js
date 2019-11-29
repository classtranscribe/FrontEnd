import _ from 'lodash'
import { api } from 'utils'
import { transControl } from "./trans.control"
import { 
  SEARCH_INIT, 
  ARRAY_EMPTY, 
  ARRAY_INIT,
  SEARCH_HIDE, 
  SEARCH_BEGIN, 
  SEARCH_RESULT, 
  SEARCH_TRANS_IN_VIDEO 
} from "./constants.util"

/**
 * Functions for controlling user preference
 */

export const searchControl = {
  search_: SEARCH_INIT,
  hasResult: false,
  playlists: [],
  offeringId: '',
  setSearch: function() {}, 

  init: function({setSearch, playlists, offeringId}) {
    if (setSearch) this.setSearch = setSearch
    if (playlists) this.playlists = playlists
    if (offeringId) this.offeringId = offeringId
  },

  updateSearch: function(search) {
    let newSearch = { ...this.search_, ...search }
    this.search_ = newSearch
    this.setSearch(newSearch)
  },

  openSearch: function() {
    let status = this.hasResult ? SEARCH_RESULT : SEARCH_BEGIN 
    this.updateSearch({ status })
  },

  closeSearch: function() {
    if (this.search_.status === SEARCH_HIDE) return;
    this.updateSearch({ status: SEARCH_HIDE })
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
    console.log('inCourseTransResults', inCourseTransResults)
    return inCourseTransResults
  },

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

  getResults: async function(value) {
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
  }

}