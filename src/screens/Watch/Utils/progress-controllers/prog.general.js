import { parseSec } from '../helpers';

const DEFAULT_ELEM = { style: {} };
// Global HTML elements are declared here
let progressEl = null;
let seekBarEl = null;
let seekToEl = null;
let seekingTime = null;
// the with of the progress bar
let totalWidth = 0;

/**
 * Controller for player progress bar
 */
export class ProgressController {
  constructor() {
    this.wasPlaying = false;
    this.isDragging = false;
    this.draggable = false;

    this.updateTotalWidth = this.updateTotalWidth.bind(this);

    window.addEventListener('resize', this.updateTotalWidth);
  }

  /**
   * @param {UIEvent} e
   */
  updateTotalWidth() {
    totalWidth = this.seekBarEl.clientWidth;
  }

  /**
   * Reset/Refresh the progress controller
   */
  reset() {
    progressEl = null;
    seekBarEl = null;
    seekToEl = null;
    seekingTime = null;
    totalWidth = 0;
    this.setProgress(0);
  }

  /**
   * @returns {Number} the width of the progress bar
   */
  get totalWidth() {
    if (!totalWidth) {
      totalWidth = this.seekBarEl.clientWidth || 0;
    }

    return totalWidth;
  }

  /**
   * HTMLDivElement progress row
   * @returns {HTMLDivElement}
   */
  get progressEl() {
    if (!progressEl) {
      progressEl = document.getElementById('progress-amount') || DEFAULT_ELEM;
    }

    return progressEl;
  }

  /**
   * HTMLDivElement seek bar
   * @returns {HTMLDivElement}
   */
  get seekBarEl() {
    if (!seekBarEl) {
      seekBarEl = document.getElementById('seeking') || DEFAULT_ELEM;
    }

    return seekBarEl;
  }

  /**
   * HTMLDivElement seek row
   * @returns {HTMLDivElement}
   */
  get seekToEl() {
    if (!seekToEl) {
      seekToEl = document.getElementById('seeking-to') || DEFAULT_ELEM;
    }

    return seekToEl;
  }

  /**
   * HTMLDivElement seek time box
   * @returns {HTMLDivElement}
   */
  get seekingTime() {
    if (!seekingTime) {
      seekingTime = document.getElementById('seeking-time') || DEFAULT_ELEM;
    }

    return seekingTime;
  }

  /**
   * set the width of progess elem
   * @param {Number} ratio
   */
  setProgress(ratio) {
    const ratio_ = ratio > 1 ? ratio : ratio * 100;
    this.progressEl.style.width = `${ratio_}%`;
  }

  /**
   * display seek time box
   * @param {MouseEvent} e
   * @param {Number} duration
   */
  displayTime(e, duration, setSeekTo = true) {
    if (e.clientX < 46) return;
    const totalWidth_ = this.totalWidth;
    if (setSeekTo) {
      this.seekToEl.style.width = `${((e.clientX - 11) / totalWidth_) * 100}%`;
    }

    const seekingTime_ = this.seekingTime;

    seekingTime_.style.opacity = 1;
    seekingTime_.innerText = parseSec(Math.floor(((e.clientX - 11) / totalWidth_) * duration));
    seekingTime_.style.marginLeft = `${((e.clientX - 46) / totalWidth_) * 100}%`;
  }

  /**
   * Hide time box
   */
  hideTime() {
    this.seekingTime.style.opacity = 0;
  }

  /**
   * Seek to the time based on the current event position
   * @param {MouseEvent|DragEvent|Number} e
   * @param {Number} offset
   */
  seekTo(e, offset = 11) {
    const moveX = typeof e === 'number' ? e : e.clientX || e.screenX;

    const seekTo = Math.floor(((moveX - offset) / this.totalWidth) * this.watch.duration);
    this.dispatch({ type: 'watch/media_setCurrTime', payload: seekTo })
  }

  /**
   * @param {Number} time
   * @param {Number} duration
   */
  updateTime(time, duration) {
    if (!this.isDragging) {
      this.setProgress(time / duration);
    }
  }

  handleClick() {}

  handleMouseDown() {}
  handleMouseMove() {}
  handleMouseLeave() {}
  handleMouseUp() {}

  handleDragStart() {}
  handleDrag() {}
  handleDragEnd() {}

  handleTouchStart() {}
  handleTouchMove() {}
  handleTouchEnd() {}

  vc_pause() {
    this.dispatch({ type: 'watch/media_pause' })
  }
  vc_play() {
    this.dispatch({ type: 'watch/media_play' })
  }
  setModel(dispatch, watch) {
    this.dispatch = dispatch;
    this.watch = watch;
  }
}
