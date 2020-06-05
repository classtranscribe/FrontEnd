export class VideoNodeController {
  /**
   * Create a video node controller
   * @param {HTMLVideoElement} node - the video node
   */
  constructor(node) {
    this.node = node;
  }

  get paused() {
    if (!this.node) return true;
    return this.node.paused;
  }

  get muted() {
    if (!this.node) return true;
    return this.node.muted;
  }

  get volume() {
    if (!this.node) return 1;
    return this.node.volume;
  }

  get playbackRate() {
    if (!this.node) return 1;
    return this.node.playbackRate;
  }

  play() {
    if (!this.node) return;
    this.node.play();
  }

  pause() {
    if (!this.node) return;
    this.node.pause();
  }

  mute() {
    if (!this.node) return;
    this.node.muted = true;
  }

  setVolume(volume) {
    if (!this.node) return;
    this.node.volume = volume;
  }

  setPlaybackRate(playbackRate) {
    if (!this.node) return;
    this.node.playbackRate = playbackRate;
  }
}