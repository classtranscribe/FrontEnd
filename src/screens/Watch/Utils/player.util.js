/**
 * Functions for controlling video players
 */

export const videoControl = {
  videoNode1: null,
  videoNode2: null,
  init: function(videoNode1, videoNode2) {
    this.videoNode1 = videoNode1
    this.videoNode2 = videoNode2
  },

  pause: function() {
    if (this.videoNode1) this.videoNode1.pause()
    if (this.videoNode2) this.videoNode2.pause()
  },

  play: function()  {
    if (this.videoNode1) this.videoNode1.play()
    if (this.videoNode2) this.videoNode2.play()
  },

  setCurrTime: function(time) {
    if (this.videoNode1) this.videoNode1.currentTime = time
    if (this.videoNode2) this.videoNode2.currentTime = time
  },

  mute: function() {
    if (!this.videoNode1) return;
    if (this.videoNode1.muted) this.videoNode1.muted = false
    else this.videoNode1.muted = true
  },

  changeVolume: function(volume) {
    if (!this.videoNode1) return;
    if (this.videoNode1.muted) this.videoNode1.muted = false
    this.videoNode1.volume = Number(volume)
  },

  enterFullScreen: function() {
    if (!this.videoNode1) return;
    var elem = document.getElementById("ct-player-container") || {}
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Firefox */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE/Edge */
      elem.msRequestFullscreen();
    }
  },

  exitFullScreen: function() {
    if (!this.videoNode1) return;
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) { /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) { /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) { /* IE/Edge */
      document.msExitFullscreen();
    }
  }
}