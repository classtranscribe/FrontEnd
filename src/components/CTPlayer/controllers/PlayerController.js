import _ from 'lodash';
import { isSafari } from 'react-device-detect';
import { v4 as uuid } from 'uuid';
import { api, elem, timestr } from 'utils';
import iniState from './initial-state';
import Languages from './Languages';
import VideoController from './VideoController';
import playerKeyDownEventHandler from './keydown-event';

/**
 * The video player controller
 */
class PlayerController extends VideoController {
  /**
   * Create a CTPlayer controller
   * @param {Function} setPlayerState - function used to set states in CTPlayer
   */
  constructor(setPlayerState, id) {
    super(setPlayerState);
    this.id = id || uuid();

    // Node of the player
    this.playerNode = null;

    this.size = iniState.size;
    this.screenMode = iniState.screenMode;
    this.isSwappedScreen = iniState.isSwappedScreen;
    this.isFullscreen = iniState.isFullscreen;

    // Mouse over timer for wrapper
    this.mouseOverTimer = null;

    // Initialize state
    this.error = iniState.error;
    this.media = iniState.media;
    this.transcriptions = iniState.transcriptions;
    this.currTranscription = iniState.currTranscription;
    this.openCC = iniState.openCC;
    this.languages = [];
    this.language = iniState.language;
    this.captions = iniState.captions;
    this.currCaption = iniState.currCaption;

    // CC styles
    this.ccFontSize = iniState.ccFontSize;
    this.ccFontColor = iniState.ccFontColor;
    this.ccOpacity = iniState.ccOpacity;
    this.ccBackgroundColor = iniState.ccBackgroundColor;

    // Binding functions to player object
    this.registerPlayer = this.registerPlayer.bind(this);
    this.swapScreens = this.swapScreens.bind(this);
    this.setScreenMode = this.setScreenMode.bind(this);
    this.setOpenCC = this.setOpenCC.bind(this);
    this.closeCC = this.closeCC.bind(this);
    this.toggleCC = this.toggleCC.bind(this);
    this.changeLanguage = this.changeLanguage.bind(this);
    this.enterFullscreen = this.enterFullscreen.bind(this);
    this.exitFullscreen = this.exitFullscreen.bind(this);
    this.onFullscreenChange = this.onFullscreenChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.handlePlayerSize = this.handlePlayerSize.bind(this);

    this.setCCFontSize = this.setCCFontSize.bind(this);
    this.setCCFontColor = this.setCCFontColor.bind(this);
    this.setCCOpacity = this.setCCOpacity.bind(this);
    this.setCCBackgroundColor = this.setCCBackgroundColor.bind(this);
  }

  /**
   * 
   * @param {HTMLDivElement} node 
   */
  registerPlayer(node) {
    this.playerNode = node;
    if (node) {
      node.addEventListener('keydown', this.onKeyDown);
      if (isSafari) {
        node.addEventListener('webkitfullscreenchange', this.onFullscreenChange);
      } else {
        node.addEventListener('fullscreenchange', this.onFullscreenChange);
      }
      this.handlePlayerSize();
    }
  }

  handlePlayerSize() {
    if (!this.playerNode) return;
    const { width } = this.playerNode.getBoundingClientRect();
    if (width >= 1000) {
      this.setSize('lg');
    } else if (width >= 700) {
      this.setSize('md');
    } else {
      this.setSize('xs');
    }
  }

  setSize(size) {
    this.setState('size', size);
  }

  setScreenMode(screenMode) {
    this.setState('screenMode', screenMode);
  }

  swapScreens() {
    this.setState('isSwappedScreen', !this.isSwappedScreen);
  }

  setCCFontSize(ccFontSize) {
    this.setState('ccFontSize', ccFontSize);
  }

  setCCFontColor(ccFontColor) {
    this.setState('ccFontColor', ccFontColor);
  }

  setCCOpacity(ccOpacity) {
    this.setState('ccOpacity', ccOpacity);
  }

  setCCBackgroundColor(ccBackgroundColor) {
    this.setState('ccBackgroundColor', ccBackgroundColor);
  }

  setError(error) {
    this.setState('error', error);
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

  setOpenCC(openCC) {
    this.setState('openCC', openCC);
  }
  
  closeCC() {
    this.setOpenCC(false);
  }

  toggleCC() {
    this.setOpenCC(!this.openCC);
  }

  async setupMedia(mediaId) {
    if (!mediaId) return;
    try {
      let { data } = await api.getMediaById(mediaId);
      this.setMedia(api.parseMedia(data));
    } catch (error) {
      // TODO
      this.setError(api.errorType(error));
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

  setupTranscriptions(media, defaultLang = Languages.English) {
    const { transcriptions } = media;

    if (Array.isArray(transcriptions) && transcriptions.length > 0) {
      this.setTranscriptions(transcriptions);
      this.languages = _.map(transcriptions, trans => ({ 
        code: trans.language, 
        text: Languages.decode(trans.language)
      }));

      // if (defaultLang) {
      //   this.setOpenCC(true);
      // }

      const currTranscription = _.find(transcriptions, { language: defaultLang });
      if (currTranscription) {
        this.setCurrTranscription(currTranscription);
      } else {
        this.setCurrTranscription(transcriptions[0]);
      }
    }
  }

  async setupCaptions(currTranscription) {
    if (!currTranscription || !currTranscription.id) {
      this.setCaptions([]);
      this.setCurrCaption(null);
      if (this.openCC) this.toggleCC();
      return;
    }

    const { id, language, src } = currTranscription;
    this.setLanguage({ code: language, text: Languages.decode(language) });

    let captions = await this.getCaptionsByTranscriptionId(id);
    captions = _.map(captions, (cap, index) => ({ ...cap, index }));
    this.setCaptions(captions);
    this.setCurrCaption(null);
    this.updateCurrCaption(this.time);
    // if (!this.openCC) this.toggleCC();
  }

  changeLanguage(language) {
    if (!this.openCC) this.setOpenCC(true);
    let targetIndex = _.findIndex(this.transcriptions, { language });
    if (targetIndex >= 0) {
      this.setLanguage({ code: language, text: (language) });
      this.setCurrTranscription(this.transcriptions[targetIndex]);
    } else {
      this.setLanguage({ code: null, text: null });
      this.setCurrTranscription(null);
    }
  }

  updateCurrCaption(now) {
    if (!this.openCC || this.captions.length <= 0) return;
    let captions = this.captions;

    const isCurrent = (item) => {
      if (!item) return false;
      const end = timestr.toSeconds(item.end);
      const begin = timestr.toSeconds(item.begin);
      return begin <= now && now <= end;
    };

    let next = this.currCaption;

    // if it's the first time to find captions
    if (!next) {
      next = _.find(captions, isCurrent) || next;

      // if looking for caption that is after the current one
    } else if (now > timestr.toSeconds(next.begin)) {
      next = _.find(captions, isCurrent, next.index + 1) || next;

      // if looking for caption that is prior to the current one
    } else if (now < timestr.toSeconds(next.end)) {
      next = _.findLast(captions, isCurrent, next.index - 1) || next;
    }

    this.setCurrCaption(next);
  }

  enterFullscreen() {
    let node = this.playerNode;
    if (!node) return;

    elem.enterFullscreen(node);
  }

  exitFullscreen() {
    elem.exitFullScreen();
  }

  onFullscreenChange(e) {
    this.setState('isFullscreen', elem.isInFullScreen);
    this.handlePlayerSize();
  }

  onKeyDown(e) {
    playerKeyDownEventHandler(e, this);
  }
}

export default PlayerController;