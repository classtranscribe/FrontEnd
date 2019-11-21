import $ from 'jquery'
import { util } from 'utils'

export const staticVJSOptions = require('./staticVJSOptions.json')
export { keyDownPlugin } from './keyDownPlugin'
export { getControlPlugin } from './controlPlugin'


export const captionLangMap = {
  "en-US": "English",
  "zh-Hans": "Simplified-Chinese",
  "ko": "Korean",
  "es": "Spanish"
}

export const ctVideo = {
  waitingNum: 0,
  isSeeking: false,
  mediaId: '',
  offeringId: '',
  sendUserAction: function() {},
  init: function({mediaId, sendUserAction, offeringId}) {
    if (sendUserAction) this.sendUserAction = sendUserAction
    if (mediaId) this.mediaId = mediaId
    if (offeringId) this.offeringId = offeringId
  },
  saveVideoTime: function(e, update=false) {
    util.saveVideoTime({
      update,
      mediaId: this.mediaId, 
      timeStamp: Math.floor(e.target.currentTime), 
      ratio: e.target.currentTime / e.target.duration, 
      offeringId: this.offeringId
    })
  },
  setVideoLoading: function(loading) {
    if (loading) {
      $('.loading-wrapper').removeClass('hide-loading-wrapper')
    } else if ( !$('.hide-loading-wrapper').length ) {
      $('.loading-wrapper').addClass('hide-loading-wrapper')
    }
  },

  syncPlay: function(e, all) {
    const videoElems = $("video")
    if (videoElems.length < 2) return;
    videoElems.each( (index, videoElem) => {
      if (all || e.target !== videoElem) videoElem.play()
    })
  },
  
  syncPause: function(e, all) {
    const videoElems = $("video")
    if (videoElems.length < 2) return;
    videoElems.each( (index, videoElem) => {
      if (all || e.target !== videoElem) videoElem.pause()
    })
  },
  
  setCurrTime: function(e, time) {
    let currTime = time || e.target.currentTime
    $("video").each( (index, videoElem) => {
      if (time || e.target !== videoElem) videoElem.currentTime = currTime
    })
  },

  onLoaded: function (e) {
    // this.syncPlay(e)
    this.setVideoLoading(false)
  },

  onPlay: function(e, isPrimary) {
    if (!isPrimary) return;
    this.syncPlay(e)
    if (isPrimary && !this.isSeeking) this.sendUserAction('play', { timeStamp: e.target.currentTime })
  },

  onPause: function(e, isPrimary) {
    if (!isPrimary) return;
    this.syncPause(e)
    if (isPrimary && !this.isSeeking) {
      this.sendUserAction('pause', 
        { timeStamp: e.target.currentTime }, 
        e.target.currentTime / e.target.duration
      )
    }
  },

  onSeeking: function(e, isPrimary) {
    this.isSeeking = true
    this.setVideoLoading(true)
    if (!isPrimary) return;
    this.setCurrTime(e)
    if (isPrimary) this.sendUserAction('seeking', { 
      seekingTo: e.target.currentTime,
      timeStamp: e.target.currentTime
    })
  },

  onSeeked: function(e, isPrimary) {
    this.syncPlay(e)
    if (isPrimary) {
      this.sendUserAction('seeked', { 
        seekedTo: e.target.currentTime,
        timeStamp: e.target.currentTime
      })
    }
    if (this.waitingNum === 0) {
      this.isSeeking = false
      this.setVideoLoading(false)
    }
  },

  onWaiting: function(e) {
    this.syncPause(e)
    this.setVideoLoading(true)
    if (this.waitingNum < 2) this.waitingNum += 1
    // console.log('waitingNum', this.waitingNum)
  },

  onPlaying: function(e) {
    if (this.waitingNum > 0) this.waitingNum -= 1
    // console.log('waitingNum', this.waitingNum)
    if (this.waitingNum === 0) {
      this.syncPlay(e)
      this.setVideoLoading(false)
    } 
  },
}