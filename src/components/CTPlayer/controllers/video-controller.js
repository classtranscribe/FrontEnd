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
    this.toggleCC = this.toggleCC.bind(this);
  }

  setState(key, value) {
    if (typeof this.setPlayerState === 'function') {
      this.setPlayerState(key, value);
      this[key] = value;
    }
  }

  PLAYBACK_RATES = playbackRateOptions;

  registerVideo1(node) {
    this.video1 = new VideoNode(node);
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

  openCC = false;
  toggleCC() {
    this.setState('openCC', !this.openCC);
  }

  enterFullscreen() {

  }

  exitFullscreen() {

  }
}