/**
 * Functions for controlling user preference
 */
const PLAYBACK_RATE = 'watch-pref-placyback-rate'
const CC_ON = 'wath-pref-cc-on' 
const ARTICLE_VIEW = 'watch-pref-article-view'
const TRANS_AUTO_SCROLL = 'watch-pref-auto-scroll'
const PAUSE_WHILE_AD = 'watch-pref-pause-ad'
const PAUSE_WHILE_EDITING = 'watch-pref-pause-edit'

export const preferControl = {
  externalFunctions: {},

  init: function(externalFunctions) {
    this.externalFunctions = { ...this.externalFunctions, ...externalFunctions }
  },

  closedCaptionOn: function(bool) {
    
  },

  pauseWhileEditing: function(bool) {

  },

  pauseWhileAD: function(bool) {

  },


}