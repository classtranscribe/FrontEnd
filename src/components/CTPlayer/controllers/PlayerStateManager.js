import iniState from './initial-state';

class PlayerStateManager {
  constructor(setState) {
    this.__setState = setState;
  }

  setState(key, value) {
    if (typeof this.__setState === 'function') {
      this.__setState(key, value);
      this[key] = value;
    }
  }

  error = iniState.error;
  setError(error) {
    this.setState('error', error);
  }

  // -----------------------------------------------------------------
  // Media Data
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  media = iniState.media;
  setMedia(media) {
    this.setState('media', media);
  }

  src1 = iniState.src1;
  setSrc1(src1) {
    this.setState('src1', src1);
  }

  src2 = iniState.src2;
  setSrc2(src2) {
    this.setState('src2', src2);
  }

  // -----------------------------------------------------------------
  // Caption Data
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  transcriptions = iniState.transcriptions;
  setTranscriptions(transcriptions) {
    this.setState('transcriptions', transcriptions);
  }

  currTranscription = iniState.currTranscription;
  setCurrTranscription(currTranscription) {
    this.setState('currTranscription', currTranscription);
  }

  language = iniState.language;
  setLanguage(language) {
    this.setState('language', language);
  }

  captions = iniState.captions;
  setCaptions(captions) {
    this.setState('captions', captions);
  }

  currCaption = iniState.currCaption;
  setCurrCaption(currCaption) {
    this.setState('currCaption', currCaption);
  }

  // -----------------------------------------------------------------
  // Player Attributes
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  videoReady = iniState.videoReady;
  setVideoReady(videoReady) {
    this.setState('videoReady', videoReady);
  }

  userReady = iniState.userReady;
  setUserReady(userReady) {
    this.setState('userReady', userReady);
  }

  userActive = iniState.userActive;
  setUserActive(userActive) {
    this.setState('userActive', userActive);
  }

  size = iniState.size;
  setSize(size) {
    this.setState('size', size);
  }

  event = iniState.event;
  setEvent(event) {
    this.setState('event', event);
  }
  
  screenMode = iniState.screenMode;
  setScreenMode(screenMode) {
    this.setState('screenMode', screenMode);
  }

  isSwappedScreen = iniState.isSwappedScreen;
  setIsSwappedScreen(isSwappedScreen) {
    this.setState('isSwappedScreen', isSwappedScreen);
  }

  isFullscreen = iniState.isFullscreen;
  setIsFullscreen(isFullscreen) {
    this.setState('isFullscreen', isFullscreen);
  }

  ccStyle = iniState.ccStyle;
  setCCStyle(ccStyle) {
    this.setState('ccStyle', ccStyle);
  }

  openCC = iniState.openCC;
  setOpenCC(openCC) {
    this.setState('openCC', openCC);
  }

  // -----------------------------------------------------------------
  // Video
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  duration = iniState.duration;
  setDuration(duration) {
    this.setState('duration', duration);
  }

  time = iniState.time;
  setTime(time) {
    this.setState('time', time);
  }

  bufferedTime = iniState.bufferedTime;
  setBufferedTime(bufferedTime) {
    this.setState('bufferedTime', bufferedTime);
  }

  muted = iniState.muted;
  setMuted(muted) {
    this.setState('muted', muted);
  }

  volume = iniState.volume;
  setVolume(volume) {
    this.setState('volume', volume);
  }

  playbackRate = iniState.playbackRate;
  setPlaybackRate(playbackRate) {
    this.setState('playbackRate', playbackRate);
  }

  isPaused = iniState.isPaused;
  setIsPaused(isPaused) {
    this.setState('isPaused', isPaused);
  }

  isEnded = iniState.isEnded;
  setIsEnded(isEnded) {
    this.setState('isEnded', isEnded);
  }

  // -----------------------------------------------------------------
  // Range
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  openRange = iniState.openRange;
  setOpenRange(openRange) {
    this.setState('openRange', openRange);
  }

  range = iniState.range;
  setRange(range) {
    this.setState('range', range);
  }
}

export default PlayerStateManager;