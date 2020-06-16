import iniState from './initial-state';
import VideoNode from './video-node';
import Constants from './player-constants';

class VideoController {
  /**
   * Create a Video Controller for CTPlayer
   * @param {Function} setStateFunction - function used to set states in CTPlayer
   */
  constructor(setStateFunction) {
    // register set state function
    this.___SET_STATE___ = setStateFunction;

    // video nodes
    this.video1 = null;
    this.video2 = null;

    // ready states
    this.video1Ready = false;
    this.video2Ready = true;
    this.videoReady = iniState.videoReady;
    this.userReady = iniState.userReady;
    
    // video attributes
    this.beginAt = 0;
    this.duration = iniState.duration;
    this.time = iniState.time;
    this.bufferedTime = iniState.bufferedTime;
    this.muted = iniState.muted;
    this.volume = iniState.volume;
    this.playbackRate = iniState.playbackRate;
    this.event = iniState.event;
    this.openCC = iniState.openCC;

    // range
    this.openRange = iniState.openRange;
    this.range = iniState.range;
    this.isPlayingRange = false;

    // binding functions
    this.registerVideo1 = this.registerVideo1.bind(this);
    this.registerVideo2 = this.registerVideo2.bind(this);
    this.play = this.play.bind(this);
    this.pause = this.pause.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.replay = this.replay.bind(this);
    this.setCurrentTime = this.setCurrentTime.bind(this);
    this.mute = this.mute.bind(this);
    this.unmute = this.unmute.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.setVolume = this.setVolume.bind(this);
    this.setPlaybackRate = this.setPlaybackRate.bind(this);
    this.setOpenCC = this.setOpenCC.bind(this);
    this.toggleCC = this.toggleCC.bind(this);
    this.setRange = this.setRange.bind(this);
    this.toggleRange = this.toggleRange.bind(this);
    this.playRange = this.playRange.bind(this);

    // video event handlers
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onVideo1CanPlay = this.onVideo1CanPlay.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
    this.onPause = this.onPause.bind(this);
    this.onPlay = this.onPlay.bind(this);
    this.onSeeking = this.onSeeking.bind(this);
    this.onEnded = this.onEnded.bind(this);
  }

  setState(key, value) {
    if (typeof this.___SET_STATE___ === 'function') {
      this.___SET_STATE___(key, value);
      this[key] = value;
    }
  }

  /**
   * 
   * @param {HTMLVideoElement} node 
   */
  registerVideo1(node) {
    this.video1 = new VideoNode(node);
    if (node) {
      node.addEventListener('durationchange', this.onDurationChange);
      node.addEventListener('progress', this.onProgress);
      node.addEventListener('timeupdate', this.onTimeUpdate);
      node.addEventListener('seeking', this.onSeeking);
      node.addEventListener('ended', this.onEnded);
      node.addEventListener('pause', this.onPause);
      node.addEventListener('play', this.onPlay);
      node.addEventListener('canplay', this.onVideo1CanPlay);
    }
  }

  registerVideo2(node) {
    this.video2 = new VideoNode(node);
    if (node) {
      this.video2Ready = false;
      node.addEventListener('canplay', this.onVideo2CanPlay);
    }
  }

  setBeginAt(beginAt) {
    if (typeof beginAt === 'number') {
      this.beginAt = beginAt;
    }
  }

  videoIsReady() {
    if (this.video1Ready && (this.video2Ready || !this.video2)) {
      this.setState('videoReady', true);

      if (this.beginAt > 0) {
        this.setCurrentTime(this.beginAt);
      }
    }
  }

  userIsReady() {
    this.setState('userReady', true);
  }

  setEvent(event) {
    this.setState('event', event);
  }

  eventTimer = null;
  toggleEvent(event) {
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
    }

    this.setEvent(null);
    this.setEvent(event);
    this.eventTimer = setTimeout(() => {
      this.setEvent(null);
    }, 600);
  }

  pause() {
    if (!this.video1) return;
    this.video1.pause();
    if (this.video2) this.video2.pause();
    this.toggleEvent(Constants.CTPE_PAUSE);
  }

  play() {
    if (!this.video1) return;
    this.video1.play();
    if (this.video2) this.video2.play();
    this.toggleEvent(Constants.CTPE_PLAY);
  }

  togglePause() {
    if (!this.video1) return;
    if (this.video1.paused) {
      this.play();
    } else {
      this.pause();
    }
  }

  replay() {
    this.setState('time', 0);
    this.play();
    if (this.isEnded) this.setState('isEnded', false);
  }

  setCurrentTime(time) {
    if (!this.video1) return;
    if (typeof time !== 'number') return;
  
    if (time < 0) {
      time = 0;
    } else if (time > this.duration) {
      time = this.duration;
    }

    this.video1.setCurrentTime(time);
    this.setState('time', time);
    if (this.video2) {
      this.video2.setCurrentTime(time);
    }
  }

  forward() {
    this.setCurrentTime(this.time + 5);
    this.toggleEvent(Constants.CTPE_FORWARD);
  }

  rewind() {
    this.setCurrentTime(this.time - 5);
    this.toggleEvent(Constants.CTPE_REWIND);
  }

  mute() {
    if (!this.video1) return;
    this.video1.mute();
    this.setState('muted', true);
    this.toggleEvent(Constants.CTPE_MUTE);
  }

  unmute() {
    if (!this.video1) return;
    this.video1.unmute();
    this.setState('muted', false);
    this.toggleEvent(Constants.CTPE_VOLUME_UP);
  }

  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  setVolume(volume) {
    if (!this.video1) return;
    if (volume > 1 || volume < 0) return;
    this.video1.setVolume(volume);
    this.setState('volume', volume);
  }

  volumeUp() {
    this.setVolume(this.volume + 0.05);
    this.toggleEvent(Constants.CTPE_VOLUME_UP);
  }

  volumeDown() {
    this.setVolume(this.volume - 0.05);
    this.toggleEvent(Constants.CTPE_VOLUME_DOWN);
  }

  setPlaybackRate(playbackRate) {
    if (!this.video1) return;
    this.video1.setPlaybackRate(playbackRate);
    this.setState('playbackRate', playbackRate);
  }

  setOpenCC(openCC) {
    this.setState('openCC', openCC);
  }

  toggleCC() {
    this.setOpenCC(!this.openCC);
  }

  toggleRange() {
    this.setState('openRange', !this.openRange);
    this.isPlayingRange = false;
  }

  setRange(range) {
    this.setState('range', range);
    this.isPlayingRange = false;
  }

  playRange() {
    if (this.range && this.openRange) {
      this.play();
      this.setCurrentTime(this.range[0]);
      this.isPlayingRange = true;
    }
  }

  onDurationChange({ target: { duration } }) {
    this.setState('duration', duration);

    if (this.openRange && !this.range) {
      this.setRange([0, duration]);
    }
  }

  onVideo1CanPlay({ target: { readyState } }) {
    if (readyState > 0 && !this.videoReady) {
      this.video1Ready = true;
      this.videoIsReady();
    }
  }

  onVideo2CanPlay({ target: { readyState } }) {
    if (readyState > 0 && !this.videoReady) {
      this.video2Ready = true;
      this.videoIsReady();
    }
  }

  onProgress({ target: { buffered, currentTime, duration } }) {
    if (duration > 0) {
      for (let i = 0; i < buffered.length; i += 1) {
        if (buffered.start(buffered.length - 1 - i) < currentTime) {
          this.setState('bufferedTime', buffered.end(buffered.length - 1 - i));
          break;
        }
      }
    }
  }

  lastCCUpdatedTime = 0;
  onTimeUpdate({ target: { currentTime } }) {
    if (Math.abs(this.time - currentTime) > 0.4) {
      this.setState('time', currentTime);
      this.updateCurrCaption(currentTime);
    }

    if (this.isPlayingRange) {
      if (this.range[1] <= currentTime) {
        this.pause();
        this.isPlayingRange = false;
      }
    }
  }

  updateCurrCaption() {}

  onPause() {
    this.setState('isPaused', true);
  }

  onPlay() {
    this.setState('isPaused', false);
    if (!this.userReady) this.userIsReady();
  }

  onSeeking() {
    if (this.isEnded) this.setState('isEnded', false);
  }

  onEnded() {
    this.setState('isEnded', true);
  }
}

export default VideoController;