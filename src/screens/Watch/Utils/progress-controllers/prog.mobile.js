import { ProgressController } from './prog.general'
import { videoControl } from '../player.control'

/**
 * Controller for player progress bar on Firefox
 */
export class MobileProgressController extends ProgressController {
  constructor() {
    super()
    this.draggable = false
  }

  /**
   * 
   * @param {TouchEvent} e 
   */
  handleTouchStart(e) {
    // this.isDragging = true
    if (!videoControl.paused()) {
      this.wasPlaying = true
      videoControl.pause()
    }
    if (e.touches[0]) {
      this.seekTo(e.touches[0].clientX)
    }
  }
  /**
   * 
   * @param {TouchEvent} e 
   */
  handleTouchMove(e) {
    if (e.touches[0]) {
      this.seekTo(e.touches[0].clientX)
    }
  }
  /**
   * 
   * @param {TouchEvent} e 
   */
  handleTouchEnd(e) {
    // this.isDragging = false
    if (this.wasPlaying) {
      this.wasPlaying = false
      videoControl.play()
    }
  }
}