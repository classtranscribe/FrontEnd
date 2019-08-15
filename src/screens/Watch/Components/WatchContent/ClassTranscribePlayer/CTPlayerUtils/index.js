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
  wasWaited: false,
  setWasWaited: function(value) {
    this.wasWaited = value
  },
  getWasWaited: function() { return this.wasWaited },
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

  onPause: function(e) { 
    this.syncPause(e)
  },
  onPlay: function(e) { 
    this.syncPlay(e)
  },
  onSeeking: function(e) { 
    this.setCurrTime(e)
  },
  onSeeked: function(e) { 
    if (this.getWasWaited()) {
      this.syncPlay(e)
      this.setVideoLoading(false)
      return this.setWasWaited(false)
    }
    const videoElems = $("video")
    if (videoElems.length < 2) return;
    var thisVideo = e.target, otherVideo
    videoElems.each( (index, videoElem) => {
      if (thisVideo !== videoElem) otherVideo = videoElem
    })
    if (otherVideo.paused) {
      this.setWasWaited(true)
      thisVideo.pause()
    }
  },
  onPlaying: function(e) {
    console.log('playing')
    this.syncPlay(e)
    this.setVideoLoading(false)
  },
  onWaiting: function(e) {
    console.log('waiting')
    this.syncPause(e)
    this.setVideoLoading(true)
  },

  
  setCurrTime: function(e, time) {
    let currTime = time || e.target.currentTime
    $("video").each( (index, videoElem) => {
      if (time || e.target !== videoElem) videoElem.currentTime = currTime
    })
  },
  
  hasPausedVideos: function() {
    var hasPausedVideos = false
    $("video").each( (index, videoElem) => {
      if (videoElem.paused) hasPausedVideos = true
    })
    return hasPausedVideos
  },
  
  setVideoLoading: function(loading) {
    if (loading) {
      $('.loading-wrapper').removeClass('hide-loading-wrapper')
    } else if(!$('.hide-loading-wrapper').length ) {
      $('.loading-wrapper').addClass('hide-loading-wrapper')
    }
  }
}