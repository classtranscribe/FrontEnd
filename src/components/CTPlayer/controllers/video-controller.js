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

    this.time = 0;
    this.bufferedTime = 0;
    this.muted = false;
    this.volume = 1;
    this.playbackRate = 1;
    this.openCC = false;
    this.openRange = false;
    this.range = null;

    this.isPlayingRange = false;

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
    this.setRange = this.setRange.bind(this);
    this.toggleRange = this.toggleRange.bind(this);
    this.playRange = this.playRange.bind(this);
    this.onDurationChange = this.onDurationChange.bind(this);
    this.onProgress = this.onProgress.bind(this);
    this.onTimeUpdate = this.onTimeUpdate.bind(this);
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
      node.addEventListener('timeupdate', this.onTimeUpdate);
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

  setCurrentTime(time) {
    if (!this.video1) return;
    this.video1.setCurrentTime(time);
    this.setState('time', time);
    if (this.video2) {
      this.video2.setCurrentTime(time);
    }
  }

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

  setVolume(volume) {
    if (!this.video1) return;
    this.video1.setVolume(volume);
    this.setState('volume', volume);
  }

  setPlaybackRate(playbackRate) {
    if (!this.video1) return;
    this.video1.setPlaybackRate(playbackRate);
    this.setState('playbackRate', playbackRate);
  }

  toggleCC() {
    this.setState('openCC', !this.openCC);
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

  onDurationChange(e) {
    let { duration } = e.target;
    this.setState('duration', duration);

    if (this.openRange && !this.range) {
      this.setRange([0, duration]);
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
}