import { api } from 'utils';
import { VideoController } from './video-controller';

export { initialState } from './initial-state';

export class CTPlayerController extends VideoController {
  /**
   * Create a CTPlayer controller
   * @param {Function} setPlayerState - function used to set states in CTPlayer
   */
  constructor(setPlayerState) {
    super(setPlayerState);

    this.media = null;
  }

  setMedia(media) {
    this.setState('media', media);
  }

  setupMedia(mediaId) {
    try {
      let { data } = api.getMediaById(mediaId);
      this.setMedia(api.parseMedia(data));
    } catch (error) {
      // TODO
    }
  }
}