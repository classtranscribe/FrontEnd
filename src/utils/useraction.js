import { api } from "./http"

export const UA_TIME_UPDATE = 'timeupdate'
export const UA_PLAY = 'play'
export const UA_PAUSE = 'pause'
export const UA_SEEKING = 'seeking'
export const UA_SEEKED = 'seeked'
export const UA_CHANGE_SPEED = 'changedspeed'
export const UA_FULLSCREEN_CHANGE = 'fullscreenchange'
export const UA_SCREEN_MODE_CHANGE = 'screenmodechange'
export const UA_USER_INACTIVE = 'userinactive'

export const UA_LANG_CHANGE = 'langchange'
export const UA_FILTER_TRANS = 'filtertrans'
export const UA_EDIT_TRANS = 'edittrans'
export const UA_TRANS_VIEW_CHANGE = 'transviewchange'
export const UA_TRANS_AUTO_SCROLL_CHANGE = 'autoScrollChange'
export const UA_TRANS_PAUSE_WHEN_EDIT = 'pauseWhenEdit'
export const UA_TRANS_PAUSE_WHEN_AD_STARTS = 'pauseWhenADStarts'

export const UA_SHARE_VIDEO = 'sharelink'
export const UA_CHANGE_VIDEO = 'changevideo'
export const UA_SELECT_COURSE = 'selectcourse'

export const userAction = {
  // offeringId: undefined,
  // mediaId: undefined,

  init: function({ offeringId, mediaId }) {
    if (offeringId) this.offeringId = offeringId
    if (mediaId) this.mediaId = mediaId
    // console.error({ offeringId, mediaId })
  },

  send: async function(action, json={}, params={}) {
    if (!action) return;
    const { mediaId, offeringId } = this
    await api.sendUserAction(action, {
      json,
      mediaId,
      offeringId
    }).catch(error => {})
    // console.warn(action)
  },

  /** Player events */
  play: function(timeStamp) {
   this.send(UA_PLAY, { timeStamp })
  },
  pause: function(timeStamp) {
    this.send(UA_PAUSE, { timeStamp })
  },
  seeking: function(timeStamp) {
    this.send(UA_SEEKING, { timeStamp })
  },
  seeked: function(timeStamp) {
    this.send(UA_SEEKED, { timeStamp })
  },
  timeupdate: function(timeStamp) {
    this.send(UA_TIME_UPDATE, { timeStamp })
  },
  changespeed: function(timeStamp, playbackRate) {
    this.send(UA_CHANGE_SPEED, { timeStamp, playbackRate })
  },
  fullscreenchange: function(timeStamp, enterFullscreen) {
    this.send(UA_FULLSCREEN_CHANGE, { timeStamp, enterFullscreen })
  },
  userinactive: function(timeStamp) { // unfinished
    this.send(UA_USER_INACTIVE, { timeStamp })
  },
  screenmodechange: function(timeStamp, screenmode) {
    this.send(UA_SCREEN_MODE_CHANGE, { timeStamp, screenmode })
  },
  /** Trans, CC, AD events */
  langchange: function(timeStamp, lang) {
    this.send(UA_LANG_CHANGE, { timeStamp, lang })
  },
  filtertrans: function(value) {
    this.send(UA_FILTER_TRANS, { value })
  },
  edittrans: function(timeStamp, prevText, newText) {
    this.send(UA_EDIT_TRANS, { timeStamp, prevText, newText })
  },
  transviewchange: function(timeStamp, transview) {
    this.send(UA_TRANS_VIEW_CHANGE, { timeStamp, transview })
  },
  autoScrollChange: function(open) {
    this.send(UA_TRANS_AUTO_SCROLL_CHANGE, { open })
  },
  pauseWhenEdit: function(open) {
    this.send(UA_TRANS_PAUSE_WHEN_EDIT, { open })
  },
  pauseWhenADStarts: function(open) {
    this.send(UA_TRANS_PAUSE_WHEN_AD_STARTS, { open })
  },

  /** Other events */
  selectcourse: function(offeringId) {
    this.send(UA_SELECT_COURSE, { offeringId })
  },
  sharelink: function(timeStamp, sharedUrl) {
    this.send(UA_SHARE_VIDEO, { timeStamp, sharedUrl })
  },
  changevideo: function(timeStamp, changeTo_mediaId) {
    this.send(UA_CHANGE_VIDEO, { timeStamp, changeTo_mediaId })
  },
}
