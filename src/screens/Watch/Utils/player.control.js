import $ from 'jquery'
/**
 * Functions for controlling video players
 */
import { 
  NORMAL_MODE, PS_MODE, NESTED_MODE, 
  CTP_PLAYING, CTP_LOADING, CTP_ENDED, THEATRE_MODE, HIDE_TRANS, CTP_UP_NEXT 
} from './constants.util'
import { transControl } from './trans.control'
import { preferControl } from './preference.control'

export const videoControl = {
  videoNode1: null,
  videoNode2: null,
  duration: 0,
  isFullscreen: false,

  // setVolume, setPause, setPlaybackrate, setTime, setMute, setTrans, 
  // switchScreen, setMode, setCTPPriEvent, setCTPSecEvent
  externalFunctions: {}, 

  init: function(videoNode1, videoNode2, externalFunctions={}) {
    this.videoNode1 = videoNode1
    this.videoNode2 = videoNode2
    this.externalFunctions = externalFunctions
    
    this.addEventListenerForFullscreenChange()
    this.addEventListenerForMouseMove()
  },

  isTwoScreen: function() {
    return Boolean(this.videoNode2)
  },

  isSwitched: false,
  switchVideo: function(bool) {
    if (!Boolean(this.videoNode2)) return;
    const toSet = bool === undefined ? !this.isSwitched : bool
    const { switchScreen } = this.externalFunctions
    if (switchScreen) switchScreen(toSet)
    this.isSwitched = toSet
  },  

  currentMode: NORMAL_MODE,
  mode: function(mode) {
    const { setMode } = this.externalFunctions
    if (setMode) {
      if (window.innerWidth <= 900 && mode === PS_MODE) {
        mode = NESTED_MODE
      } 
      if (mode === THEATRE_MODE) {
        transControl.transView(HIDE_TRANS)
      }
      setMode(mode)
      this.currentMode = mode
    }
  },
  addWindowResizeListenerForScreenMode: function() {
    if (window.innerWidth < 900) {
      if (this.currentMode === PS_MODE) {
        this.mode(NESTED_MODE)
      } 
    }
  },

  paused: function() {
    if (!this.videoNode1) return;
    return this.videoNode1.paused
  },

  handlePause: function(bool) {
    if (!this.videoNode1) return;
    if (bool === undefined) bool = this.videoNode1.paused
    if (Boolean(bool)) {
      this.play()
    } else {
      this.pause() 
    }
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
    if (setTime) {
      setTime(time)
      transControl.updateCaption(time)
    }
  },
  forward: function(sec=10) {
    if (!this.videoNode1) return;
    let now = this.currTime()
    if (now + sec < this.duration) this.currTime(now + sec)
  },
  rewind: function(sec=10) {
    if (!this.videoNode1) return;
    let now = this.currTime()
    if (now - sec > 0) this.currTime(now - sec)
  },
  seekToPercentage: function(p=0) {
    if (typeof p !== 'number' || p > 1 || p < 0) return;
    let seekTo = this.duration * p
    this.currTime(seekTo)
  },

  mute: function(bool) {
    if (!this.videoNode1) return;
    const toSet = bool === undefined ? !this.videoNode1.muted : bool
    this.videoNode1.muted = toSet

    const { setMute } = this.externalFunctions
    if (setMute) setMute(toSet)
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
    preferControl.defaultPlaybackRate(playbackRate)
  },
  playbackRateIncrement: function() {
    if (!this.videoNode1) return;
    let currPlaybackRate = this.videoNode1.playbackRate
    if (currPlaybackRate + 0.25 <= 4) this.playbackrate( currPlaybackRate + 0.25 )
  },
  playbackRateDecrease: function() {
    if (!this.videoNode1) return;
    let currPlaybackRate = this.videoNode1.playbackRate
    if (currPlaybackRate - 0.25 >= 0.25) this.playbackrate( currPlaybackRate - 0.25 )
  },


  /** Fullscreen */
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

  handleFullScreen: function() {
    if (this.isFullscreen) {
      this.exitFullScreen()
    } else {
      this.enterFullScreen()
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
  },

  /**
   * Media events
   */
  onPause: function(e) {
    this.showControlBar()
  },

  onDurationChange: function({ target: { duration } }) {
    const { setDuration } = this.externalFunctions
    setDuration(duration)
    this.duration = duration
  },

  canPlayNum: 0,
  onCanPlay: function(e) {
    // this.canPlayNum += 1
    // console.log('canPlayNum', this.canPlayNum)
    // if (this.videoNode2) {
    //   if (this.canPlayNum === 2) this.play()
    // } else {
    //   this.play()
    // }
  },

  /** Timing */
  lastTime: 0,
  lastUpdateCaptionTime: 0,
  onTimeUpdate: function({ target: { currentTime } }) {
    const { setTime } = this.externalFunctions
    // Set current time
    if (Math.abs(currentTime - this.lastTime) > .7) {
      setTime(currentTime)
      this.lastTime = currentTime
    }
    if (Math.abs(currentTime - this.lastUpdateCaptionTime) > 1) {
      // setTime(currentTime)
      // this.lastTime = currentTime

      transControl.updateTranscript(currentTime)
      this.lastUpdateCaptionTime = currentTime
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

  ctpPriEvent: CTP_LOADING,
  ctpSecEvent: CTP_LOADING,
  setCTPEvent: function(event=CTP_PLAYING, priVideo=true) {
    const { setCTPPriEvent, setCTPSecEvent } = this.externalFunctions
    if (priVideo) {
      setCTPPriEvent(event)
      this.ctpPriEvent = event
    } else {
      setCTPSecEvent(event)
      this.ctpSecEvent = event
    }
  },

  onLoadStart: function(e, priVideo=true) {
    this.setCTPEvent(CTP_LOADING, priVideo)
  },

  onLoadedData: function(e, priVideo=true) {
    this.setCTPEvent(CTP_PLAYING, priVideo)
  },

  onWaiting: function(e, priVideo=true) {
    this.setCTPEvent(CTP_LOADING, priVideo)
  },

  onPlaying: function(e, priVideo=true) {
    this.setCTPEvent(CTP_PLAYING, priVideo)
  },

  onEnded: function(e) {
    this.setCTPEvent(CTP_ENDED)
    this.pause()
  },

  onSeeking: function(e) {
    if (this.ctpPriEvent === CTP_ENDED || this.ctpPriEvent === CTP_UP_NEXT) {
      this.setCTPEvent(CTP_PLAYING)
    }
  },

  onSeeked: function(e) {
    
  },




  /** Helpers */

  timeOut: null,
  addEventListenerForMouseMove: function() {
    // let video = this
    // window.addEventListener('mousemove', function() {
    //   clearTimeout(this.timeOut);
    //   // only start the timer if the video is not paused
    //   if ( !video.paused() ) {
    //       $("#watch-ctrl-bar").show();

    //       this.timeOut = setTimeout(function () {
    //       $("#watch-ctrl-bar").fadeOut();
    //       }, 2500);
    //   }
    // })
  },
  showControlBar: function() {
    // $("#watch-ctrl-bar").show();
    // clearTimeout(this.timeOut);
  },
}