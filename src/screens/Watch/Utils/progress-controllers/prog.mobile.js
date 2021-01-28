import { ProgressController } from './prog.general';

/**
 * Controller for player progress bar on Firefox
 */
export class MobileProgressController extends ProgressController {
  constructor() {
    super();
    this.draggable = false;
  }

  /**
   *
   * @param {TouchEvent} e
   */
  handleTouchStart(e) {
    // this.isDragging = true
    if (!this.watch.paused) {
      this.wasPlaying = true;
      this.vc_pause();
    }
    if (e.touches[0]) {
      this.seekTo(e.touches[0].clientX);
    }
  }
  /**
   *
   * @param {TouchEvent} e
   */
  handleTouchMove(e) {
    if (e.touches[0]) {
      this.seekTo(e.touches[0].clientX);
    }
  }
  /**
   *
   * @param {TouchEvent} e
   */
  handleTouchEnd() {
    // this.isDragging = false
    if (this.wasPlaying) {
      this.wasPlaying = false;
      this.vc_play();
    }
  }
}
