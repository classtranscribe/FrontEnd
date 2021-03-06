import { isSafari } from 'react-device-detect';
import { ProgressController } from './prog.general';
// import { parseSec } from '../helpers'

/**
 * Controller for player progress bar on Chrome/Safari
 */
export class ChromeProgressController extends ProgressController {
  constructor() {
    super();
    this.draggable = true;
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseDown(e) {
    this.seekTo(e);
  }

  /**
   * @param {MouseEvent} e
   * @param {Number} duration
   */
  handleMouseMove(e, duration) {
    this.displayTime(e, duration);
  }

  /**
   * @param {MouseEvent} e
   */
  handleMouseLeave() {
    this.seekToEl.style.width = 0;
    this.hideTime();
  }

  /**
   * @param {DragEvent} e
   */
  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', '.');
    this.isDragging = true;
    if (!this.watch.paused) {
      this.wasPlaying = true;
      this.vc_pause();
    }
    this.seekToEl.style.width = 0;
  }

  /**
   * @param {DragEvent} e
   * @param {Number} duration
   */
  handleDrag(e, duration) {
    // console.log('on', e.pageX, e.screenX, e.clientX, e.movementX)
    this.setProgress((e.clientX - 11) / this.totalWidth);
    this.displayTime(e, duration, false);
  }

  /**
   * @param {DragEvent} e
   */
  handleDragEnd(e) {
    this.isDragging = false;
    this.hideTime();
    const offset = isSafari ? 19 : 11;
    this.seekTo(e, offset);
    if (this.wasPlaying) {
      this.wasPlaying = false;
      this.vc_play();
    }
  }
}
