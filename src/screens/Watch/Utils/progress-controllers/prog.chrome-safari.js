import { videoControl } from '../player.control'
import { ProgressController } from './prog.general'
/**
 * Controller for player progress bar
 */
class ChromeProgressController extends ProgressController {
  constructor() {
    super()
    this.draggable = true
  }

  /**
   * @param {MouseEvent} e 
   */
  handleMouseDown(e) {
    this.seekTo(e)
  }

  /**
   * @param {MouseEvent} e 
   * @param {Number} duration 
   */
  handleMouseMove(e, duration) {
    this.displayTime(e, duration)
  }

  /**
   * @param {MouseEvent} e 
   */
  handleMouseLeave(e) {
    this.seekToEl.style.width = 0
    this.hideTime()
  }

  /**
   * @param {DragEvent} e 
   */
  handleDragStart(e) {
    // e.dataTransfer.setData('text/html', 'anything')
    this.isDragging = true
    if (!videoControl.paused()) {
      this.wasPlaying = true
      videoControl.pause()
    }
    this.seekToEl.style.width = 0
  }

  /**
   * @param {DragEvent} e 
   * @param {Number} duration 
   */
  handleDrag(e, duration) {
    // console.log('on', e.pageX, e.screenX, e.clientX, e.movementX)
    this.setProgress((e.clientX - 11) / this.totalWidth)
    this.displayTime(e, duration, false)
  }

  /**
   * @param {DragEvent} e 
   */
  handleDragEnd(e) {
    this.isDragging = false
    this.hideTime()
    this.seekTo(e)
    if (this.wasPlaying) {
      this.wasPlaying = false
      videoControl.play()
    }
  }
}

export const chromeProgressCtrller = new ChromeProgressController()