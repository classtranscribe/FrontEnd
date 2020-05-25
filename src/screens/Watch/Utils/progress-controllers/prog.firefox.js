import { ProgressController } from './prog.general';

/**
 * Controller for player progress bar on Firefox
 */
export class FireFoxProgressController extends ProgressController {
  constructor() {
    super();
    this.draggable = false;
    this.isMouseDown = false;
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseDown(e) {
    this.isMouseDown = true;
    this.seekTo(e);
  }

  /**
   * @param {MouseEvent} e
   * @param {Number} duration
   */
  handleMouseMove(e, duration) {
    if (this.isMouseDown) {
      this.isDragging = true;
      this.setProgress((e.clientX - 11) / this.totalWidth);
    }
    this.displayTime(e, duration, !this.isDragging);
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseUp(e) {
    if (this.isDragging) {
      this.seekTo(e);
      this.hideTime();
      this.isDragging = false;
    }

    this.isMouseDown = false;
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseLeave(e) {
    this.seekToEl.style.width = 0;
    if (this.isDragging) {
      this.seekTo(e);
    }
    this.hideTime();
    this.isDragging = false;
    this.isMouseDown = false;
  }
}
