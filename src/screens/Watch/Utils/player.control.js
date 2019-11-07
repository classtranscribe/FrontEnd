/**
 * Functions for controlling video players
 */

export const videoControl = {
  videoNode1: null,
  videoNode2: null,
  duration: 0,
  isFullscreen: false,
  // setVolume, setPause, setPlaybackrate, setTime, setMute, setTrans, 
  // switchScreen, setMode
  externalFunctions: {}, 

  init: function(videoNode1, videoNode2, externalFunctions={}) {
    this.videoNode1 = videoNode1
    this.videoNode2 = videoNode2
    this.externalFunctions = externalFunctions
    
    this.addEventListenerForFullscreenChange()
  },

  switchVideo: function(bool) {
    const { switchScreen } = this.externalFunctions
    if (switchScreen) switchScreen(bool)
  },  

  mode: function(mode) {
    const { setMode } = this.externalFunctions
    if (setMode) setMode(mode)
  },

  pause: function() {
    if (this.videoNode1) this.videoNode1.pause()
    if (this.videoNode2) this.videoNode2.pause()

    const { setPause } = this.externalFunctions
    if (setPause) setPause(true)
  },

  play: function()  {
    if (this.videoNode1) this.videoNode1.play()
    if (this.videoNode2) this.videoNode2.play()

    const { setPause } = this.externalFunctions
    if (setPause) setPause(false)
  },

  currTime: function(time) {
    if (!this.videoNode1) return;
    if (time === undefined) return this.videoNode1.currentTime

    this.videoNode1.currentTime = time
    if (this.videoNode2) this.videoNode2.currentTime = time

    const { setTime } = this.externalFunctions
    if (setTime) setTime(time)
  },

  mute: function(bool) {
    if (!this.videoNode1) return;
    this.videoNode1.muted = bool

    const { setMute } = this.externalFunctions
    if (setMute) setMute(bool)
  },

  volume: function(volume) {
    if (!this.videoNode1) return;
    if (volume === undefined) return this.videoNode1.volume
    
    if (this.videoNode1.muted) this.videoNode1.muted = false
    this.videoNode1.volume = Number(volume)

    const { setVolume } = this.externalFunctions
    if (setVolume) setVolume(Number(volume))
  },

  playbackrate: function(playbackRate) {
    if (!this.videoNode1) return;
    if (playbackRate === undefined) return this.videoNode1.playbackRate
    this.videoNode1.playbackRate = playbackRate
    if (this.videoNode2) this.videoNode2.playbackRate = playbackRate

    const { setPlaybackrate } = this.externalFunctions
    if (setPlaybackrate) setPlaybackrate(playbackRate)
  },

  onDurationChange: function({ target: { duration } }) {
    const { setDuration } = this.externalFunctions
    setDuration(duration)
    this.duration = duration
  },

  canPlayNum: 0,
  onCanPlay: function(e) {
    this.canPlayNum += 1
    console.log('canPlayNum', this.canPlayNum)
    // if (this.videoNode2) {
    //   if (this.canPlayNum === 2) this.play()
    // } else {
    //   this.play()
    // }
  },

  lastTime: 0,
  onTimeUpdate: function({ target: { currentTime } }) {
    const { setTime } = this.externalFunctions
    if (currentTime - this.lastTime > 1) {
      setTime(currentTime)
    }
  },

  lastBuffered: 0,
  onProgress: function({ target: { buffered, currentTime, duration } }) {
    // console.log('buffered', buffered)
    if (duration > 0) {
      for (var i = 0; i < buffered.length; i++) {
        if (buffered.start(buffered.length - 1 - i) < currentTime) {
          document.getElementById("buffered-amount").style.width = (buffered.end(buffered.length - 1 - i) / duration) * 100 + "%";
          break;
        }
      }
    }
  },

  addEventListenerForFullscreenChange: function() {
    const { setFullscreen } = this.externalFunctions
    if (setFullscreen) {
      document.addEventListener('fullscreenchange', () => {
        if (this.isFullscreen) {
          setFullscreen(false)
          this.isFullscreen = false
        } else {
          setFullscreen(true)
          this.isFullscreen = true
        }
      })
    }
  },

  enterFullScreen: function() {
    if (!this.videoNode1) return;
    var elem = document.getElementById("watch-page") || {}
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