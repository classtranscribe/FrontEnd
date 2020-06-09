import _ from 'lodash';
import { api } from 'utils';
import { ENGLISH, langMap } from 'screens/Watch/Utils/constants.util';
import { timeStrToSec } from 'screens/Watch/Utils/helpers';
import { VideoController } from './video-controller';

export { initialState } from './initial-state';

export class CTPlayerController extends VideoController {
  /**
   * Create a CTPlayer controller
   * @param {Function} setPlayerState - function used to set states in CTPlayer
   */
  constructor(setPlayerState) {
    super(setPlayerState);

    // Node of the player
    this.playerNode = null;

    // Mouse over timer for wrapper
    this.mouseOverTimer = null;

    // Initialize states
    this.media = null;
    this.transcriptions = [];
    this.currTranscription = null;
    this.language = { code: ENGLISH, text: langMap[ENGLISH] };
    this.captions = [];
    this.currCaption = null;

    this.languages = [];
    this.isFullscreen = false;

    // Binding functions to player object
    this.registerPlayer = this.registerPlayer.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.enterFullscreen = this.enterFullscreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
  }

  /**
   * 
   * @param {HTMLDivnodeent} node 
   */
  registerPlayer(node) {
    this.playerNode = node;
    if (node) {
      node.addEventListener('fullscreenchange', this.onFullscreenChange);
    }
  }

  setMedia(media) {
    this.setState('media', media);
  }

  setTranscriptions(transcriptions) {
    this.setState('transcriptions', transcriptions);
  }

  setCurrTranscription(currTranscription) {
    this.setState('currTranscription', currTranscription);
  }

  setLanguage(language) {
    this.setState('language', language);
  }

  setCaptions(captions) {
    this.setState('captions', captions);
  }

  setCurrCaption(currCaption) {
    this.setState('currCaption', currCaption);
  }

  async setupMedia(mediaId) {
    try {
      let { data } = await api.getMediaById(mediaId);
      this.setMedia(api.parseMedia(data));
    } catch (error) {
      // TODO
    }
  }

  async getCaptionsByTranscriptionId(transId) {
    try {
      let { data } = await api.getCaptionsByTranscriptionId(transId);
      return data;
    } catch (error) {
      return [];
    }
  }

  setupTranscriptions(media) {
    const { transcriptions } = media;

    if (Array.isArray(transcriptions) && transcriptions.length > 0) {
      this.setTranscriptions(transcriptions);
      this.languages = _.map(transcriptions, trans => ({ 
        code: trans.language, 
        text: langMap[trans.language]
      }));

      const currTranscription = _.find(transcriptions, { language: ENGLISH });
      if (currTranscription) {
        this.setCurrTranscription(currTranscription);
      } else {
        this.setCurrTranscription(transcriptions[0]);
      }
    }
  }

  async setupCaptions(currTranscription) {
    const { id, language, src } = currTranscription;
    this.setLanguage({ code: language, text: langMap[language] });
    let captions = await this.getCaptionsByTranscriptionId(id);
    this.setCaptions(captions);
    // console.log(captions);
  }

  changeLanguage(language) {
    let targetIndex = _.findIndex(this.transcriptions, { language });
    if (targetIndex >= 0) {
      this.setLanguage({ code: language, text: langMap[language] });
      this.setCurrTranscription(this.transcriptions[targetIndex]);
    }
  }

  updateCurrCaption(now) {
    if (!this.openCC || this.captions.length <= 0) return;
    let captions = this.captions;

    const isCurrent = (item) => {
      if (!item) return false;
      const end = timeStrToSec(item.end);
      const begin = timeStrToSec(item.begin);
      return begin <= now && now <= end;
    };

    let next = this.currCaption;

    // if it's the first time to find captions
    if (!next) {
      next = _.find(captions, isCurrent) || null;

      // if looking for caption that is after the current one
    } else if (now > timeStrToSec(next.begin)) {
      next = _.find(captions, isCurrent, next.index - 1) || null;

      // if looking for caption that is prior to the current one
    } else if (now < timeStrToSec(next.end)) {
      next = _.findLast(captions, isCurrent, next.index) || null;
    }

    this.setCurrCaption(next);
  }

  enterFullscreen() {
    if (document.fullscreen) return;

    let node = this.playerNode;
    if (node.requestFullscreen) {
      node.requestFullscreen();
    } else if (node.mozRequestFullScreen) {
      /* Firefox */
      node.mozRequestFullScreen();
    } else if (node.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      node.webkitRequestFullscreen();
    } else if (node.webkitEnterFullscreen) {
      /* Safari IOS Mobile */
      node.webkitEnterFullscreen();
    } else if (node.msRequestFullscreen) {
      /* IE/Edge */
      node.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (!document.fullscreen) return;

    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      /* Firefox */
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      /* IE/Edge */
      document.msExitFullscreen();
    }
  }

  onFullscreenChange(e) {
    this.setState('isFullscreen', document.fullscreen);
  }
}