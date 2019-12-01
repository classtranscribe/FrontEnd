import { LINE_VIEW, TRANSCRIPT_VIEW, SEARCH_TRANS_IN_VIDEO } from "./constants.util"

/**
 * Functions for controlling user preference
 */
const TRUE = 'true'
const DEFAULT_PLAYBACK_RATE = 'watch-pref-placyback-rate'
const CC_ON = 'wath-pref-cc-on' 
const AD_ON = 'wath-pref-ad-on' 
const DEFAULT_TRANS_VIEW = 'watch-pref-trans-view'
const TRANS_AUTO_SCROLL = 'watch-pref-auto-scroll'
const PAUSE_WHILE_AD = 'watch-pref-pause-ad'
const PAUSE_WHILE_EDITING = 'watch-pref-pause-edit'
const DEFAULT_SEARCH_OPTION = 'watch-pref-search-opt'

export const preferControl = {
  // setTransView
  externalFunctions: {},

  init: function(externalFunctions) {
    this.externalFunctions = { ...this.externalFunctions, ...externalFunctions }
    this.autoScroll(true)
    // this.pauseWhileAD(true)
  },

  localStorageSET: function(key, bool) {
    if (bool === undefined) return this[key]
    this[key] = Boolean(bool)
    if (Boolean(bool)) {
      localStorage.setItem(key, 'true')
    } else {
      localStorage.removeItem(key)
    }
  },

  [CC_ON]: localStorage.getItem(CC_ON) === TRUE,
  cc: function(bool) {
    return this.localStorageSET(CC_ON, bool)
  },

  [AD_ON]: localStorage.getItem(AD_ON) === TRUE,
  ad: function(bool) {
    return this.localStorageSET(AD_ON, bool)
  },

  [PAUSE_WHILE_EDITING]: localStorage.getItem(PAUSE_WHILE_EDITING) === TRUE,
  pauseWhileEditing: function(bool) {
    return this.localStorageSET(PAUSE_WHILE_EDITING, bool)
  },

  [PAUSE_WHILE_AD]: localStorage.getItem(PAUSE_WHILE_AD) === TRUE,
  pauseWhileAD: function(bool) {
    return this.localStorageSET(PAUSE_WHILE_AD, bool)
  },

  [TRANS_AUTO_SCROLL]: localStorage.getItem(TRANS_AUTO_SCROLL) === TRUE,
  autoScroll: function(bool) {
    return this.localStorageSET(TRANS_AUTO_SCROLL, bool)
  },

  [DEFAULT_PLAYBACK_RATE]: localStorage.getItem(DEFAULT_PLAYBACK_RATE) === TRUE,
  defaultPlaybackRate: function(rate) {
    if (rate === undefined) {
      rate = localStorage.getItem(DEFAULT_PLAYBACK_RATE)
      if (!rate) return 1
      return parseFloat(rate)
    }
    localStorage.setItem(DEFAULT_PLAYBACK_RATE, rate.toString())
  },

  [DEFAULT_TRANS_VIEW]: localStorage.getItem(DEFAULT_TRANS_VIEW) === TRUE,
  defaultTransView: function(view) {
    if (view === undefined) {
      return localStorage.getItem(DEFAULT_TRANS_VIEW) || LINE_VIEW//TRANSCRIPT_VIEW//
    }
    localStorage.setItem(DEFAULT_TRANS_VIEW, view)
  },

  [DEFAULT_SEARCH_OPTION]: localStorage.getItem(DEFAULT_SEARCH_OPTION) === TRUE,
  defaultSearchOption: function(opt) {
    if (opt === undefined) {
      return localStorage.getItem(DEFAULT_SEARCH_OPTION) || SEARCH_TRANS_IN_VIDEO
    }
    localStorage.setItem(DEFAULT_SEARCH_OPTION, opt)
  },
}