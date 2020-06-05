import { playbackRateOptions } from 'screens/Watch/Utils/constants.util';
import { VideoNodeController } from './video-node';

export { initialState } from './initial-state';

export class CTPlayerController {
  constructor() {
    this.video1 = null;
    this.video2 = null;

    this.registerVideo1 = this.registerVideo1.bind(this);
    this.registerVideo2 = this.registerVideo2.bind(this);
  }

  PLAYBACK_RATES = playbackRateOptions;

  registerVideo1(node) {
    this.video1 = new VideoNodeController(node);
  }

  registerVideo2(node) {
    this.video2 = new VideoNodeController(node);
  }
}