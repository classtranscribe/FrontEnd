import { videoControl } from '../player.control'
import { parseSec } from '../helpers'

// Global HTML elements are declared here
var progressEl = null
var seekBarEl = null
var seekToEl = null
var seekingTime = null
// the with of the progress bar
var totalWidth = 0

/**
 * Controller for player progress bar
 */
export class ProgressController {
  constructor() {
    this.wasPlaying = false
    this.isDragging = false
    this.draggable = false

    this.updateTotalWidth = this.updateTotalWidth.bind(this)

    window.addEventListener('resize', this.updateTotalWidth)
  }


  /**
   * @param {UIEvent} e 
   */
  updateTotalWidth(e) {
    totalWidth = this.seekBarEl.clientWidth
  }

  /**
   * Reset/Refresh the progress controller
   */
  reset() {
    progressEl = null
    seekBarEl = null
    seekToEl = null
    seekingTime = null
    totalWidth = 0
    this.setProgress(0)
  }

  /**
   * @returns {Number} the width of the progress bar
   */
  get totalWidth() {
    if (!totalWidth) {
      totalWidth = this.seekBarEl.clientWidth
    }

    return totalWidth
  }

  /**
   * HTMLDivElement progress row
   * @returns {HTMLDivElement}
   */
  get progressEl() {
    if (!progressEl) {
      progressEl = document.getElementById('progress-amount')
    }

    return progressEl
  }

  /**
   * HTMLDivElement seek bar
   * @returns {HTMLDivElement}
   */
  get seekBarEl() {
    if (!seekBarEl) {
      seekBarEl = document.getElementById('seeking')
    }
    
    return seekBarEl
  }

  /**
   * HTMLDivElement seek row
   * @returns {HTMLDivElement}
   */
  get seekToEl() {
    if (!seekToEl) {
      seekToEl = document.getElementById('seeking-to')
    }
    
    return seekToEl
  }

  /**
   * HTMLDivElement seek time box
   * @returns {HTMLDivElement}
   */
  get seekingTime() {
    if (!seekingTime) {
      seekingTime = document.getElementById('seeking-time')
    }
    
    return seekingTime
  }

  /**
   * set the width of progess elem
   * @param {Number} ratio 
   */
  setProgress(ratio) {
    ratio = ratio > 1 ? ratio : ratio * 100
    this.progressEl.style.width = ratio + '%'
  }

  /**
   * display seek time box
   * @param {MouseEvent} e 
   * @param {Number} duration 
   */
  displayTime(e, duration, setSeekTo=true) {
    let totalWidth = this.totalWidth
    if (setSeekTo) {
      this.seekToEl.style.width = (((e.clientX - 11) / totalWidth)*100) + "%"
    }

    let seekingTime = this.seekingTime

    seekingTime.style.opacity = 1
    seekingTime.innerText = parseSec(
      Math.floor(((e.clientX - 11) / totalWidth) * duration)
    )
    let left = (((e.clientX - 46) / totalWidth) * 100)
    if (left > 0) {
      seekingTime.style.marginLeft = left + "%"
    }
  }

  /**
   * Hide time box
   */
  hideTime() {
    this.seekingTime.style.opacity = 0
  }

  /**
   * Seek to the time based on the current event position
   * @param {MouseEvent|DragEvent} e 
   */
  seekTo(e) {
    const seekTo = Math.floor(
      (((e.clientX || e.screenX) - 11) / this.totalWidth) * videoControl.duration
    )
    videoControl.currTime(seekTo)
  }

  /**
   * @param {Number} time 
   * @param {Number} duration 
   */
  updateTime(time, duration) {
    if (!this.isDragging) {
      this.setProgress(time / duration)
    }
  }

  handleMouseDown() {}
  handleMouseMove() {}
  handleMouseLeave() {}
  handleMouseUp() {}

  handleDragStart() {}
  handleDrag() {}
  handleDragEnd() {}
}