
/**
 * A video node controller class
 */
class VideoNode {
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

  get duration() {
    if (!this.node) return 0;
    return this.node.duration;
  }

  get currentTime() {
    if (!this.node) return 0;
    return this.node.currentTime;
  }

  play() {
    if (!this.node) return;
    if (this.node.paused) {
      this.node.play();
    }
  }

  pause() {
    if (!this.node) return;
    if (!this.node.paused) {
      this.node.pause();
    }
  }

  mute() {
    if (!this.node) return;
    this.node.muted = true;
  }

  unmute() {
    if (!this.node) return;
    this.node.muted = false;
  }

  setVolume(volume) {
    if (!this.node) return;
    this.node.volume = volume;
  }

  setPlaybackRate(playbackRate) {
    if (!this.node) return;
    this.node.playbackRate = playbackRate;
  }

  setCurrentTime(time) {
    if (!this.node) return;
    this.node.currentTime = time;
  }
}

export default VideoNode;