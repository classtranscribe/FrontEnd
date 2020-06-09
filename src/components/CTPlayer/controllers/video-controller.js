import { playbackRateOptions } from 'screens/Watch/Utils/constants.util';
import { VideoNode } from './video-node';

export class VideoController {
  /**
   * Create a Video Controller for CTPlayer
   * @param {Function} setPlayerState - function used to set states in CTPlayer
   */
  constructor(setPlayerState) {
    this.video1 = null;
    this.video2 = null;

    this.setPlayerState = setPlayerState;

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
    this.toggleCC = this.toggleCC.bind(this);
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onProgress = this.onProgress.bind(this);
  }

  setState(key, value) {
    if (typeof this.setPlayerState === 'function') {
      this.setPlayerState(key, value);
      this[key] = value;
    }
  }

  PLAYBACK_RATES = playbackRateOptions;

  /**
   * 
   * @param {HTMLVideoElement} node 
   */
  registerVideo1(node) {
    this.video1 = new VideoNode(node);
    if (node) {
      node.addEventListener('durationchange', this.onDurationChange);
      node.addEventListener('progress', this.onProgress);
    }
  }

  registerVideo2(node) {
    this.video2 = new VideoNode(node);
  }

  pause() {
    if (!this.video1) return;
    this.video1.pause();
    if (this.video2) this.video2.pause();
    this.setState('isPaused', true);
  }

  play() {
    if (!this.video1) return;
    this.video1.play();
    if (this.video2) this.video2.play();
    this.setState('isPaused', false);
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
  }

  time = 0;
  setCurrentTime(time) {
    if (!this.video1) return;
    this.video1.setCurrentTime(time);
    this.setState('time', time);
    if (this.video2) {
      this.video2.setCurrentTime(time);
    }
  }

  muted = false;
  mute() {
    if (!this.video1) return;
    this.video1.mute();
    this.setState('muted', true);
  }

  unmute() {
    if (!this.video1) return;
    this.video1.unmute();
    this.setState('muted', false);
  }

  toggleMute() {
    if (this.muted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  volume = 1;
  setVolume(volume) {
    if (!this.video1) return;
    this.video1.setVolume(volume);
    this.setState('volume', volume);
  }

  playbackRate = 1;
  setPlaybackRate(playbackRate) {
    if (!this.video1) return;
    this.video1.setPlaybackRate(playbackRate);
    this.setState('playbackRate', playbackRate);
  }

  openCC = false;
  toggleCC() {
    this.setState('openCC', !this.openCC);
  }

  onDurationChange(e) {
    this.setState('duration', e.target.duration);
  }

  bufferedTime = 0;
  onProgress({ target: { buffered, currentTime, duration } }) {
    // console.log('buffered', buffered)
    if (duration > 0) {
      for (let i = 0; i < buffered.length; i += 1) {
        if (buffered.start(buffered.length - 1 - i) < currentTime) {
          this.setState('bufferedTime', buffered.end(buffered.length - 1 - i));
          break;
        }
      }
    }
  }
}