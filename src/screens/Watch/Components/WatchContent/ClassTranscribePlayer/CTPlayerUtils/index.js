import $ from 'jquery'
export const staticVJSOptions = require('./staticVJSOptions.json')
export { keyDownPlugin } from './keyDownPlugin'
export { getControlPlugin } from './controlPlugin'


export const captionLangMap = {
  "en-US": "English",
  "zh-Hans": "Chinese", //Simplified 
  "ko": "Korean",
  "es": "Spanish"
}

export const ctVideo = {
  waitingNum: 0,
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

  onPlay: function(e, isPrimary) {
    if (isPrimary) this.syncPlay(e)
  },

  onPause: function(e, isPrimary) {
    if (isPrimary) this.syncPause(e)
  },

  onSeeking: function(e, isPrimary) {
    this.setVideoLoading(true)
    if (isPrimary) this.setCurrTime(e)
  },

  onSeeked: function(e) {
    this.syncPlay(e)
    if (this.waitingNum === 0) {
      this.setVideoLoading(false)
    }
  },

  onWaiting: function(e) {
    this.syncPause(e)
    this.setVideoLoading(true)
    if (this.waitingNum < 2) this.waitingNum += 1
    console.log('waitingNum', this.waitingNum)
  },

  onPlaying: function(e) {
    if (this.waitingNum > 0) this.waitingNum -= 1
    console.log('waitingNum', this.waitingNum)
    if (this.waitingNum === 0) {
      this.syncPlay(e)
      this.setVideoLoading(false)
    } 
  },
  
  setVideoLoading: function(loading) {
    if (loading) {
      $('.loading-wrapper').removeClass('hide-loading-wrapper')
    } else if ( !$('.hide-loading-wrapper').length ) {
      $('.loading-wrapper').addClass('hide-loading-wrapper')
    }
  }
}