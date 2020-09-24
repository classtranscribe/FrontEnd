import _ from 'lodash';
import { isSafari } from 'react-device-detect';
import { v4 as uuid } from 'uuid';
import { api, elem, timestr } from 'utils';
import LConstants from './constants/LanguageConstants';
import VideoController from './VideoController';
import _playerKeyDownEventHandler from './keydown-event';

/**
 * The video player controller
 */
class PlayerController extends VideoController {
  /**
   * Create a CTPlayer controller
   * @param {Any} stateManager - a state manager for video controller
   */
  constructor(stateManager, id) {
    super(stateManager);
    // Player ID
    this.id = id || uuid();
    // Node of the player
    this.playerNode = null;
    // Mouse over timer for wrapper
    this.mouseOverTimer = null;
    // Languages for current media
    this.languages = [];

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

  // -----------------------------------------------------------------
  // Initialize Player Properties
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  /**
   * Register player node
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
      this.state.setSize('lg');
    } else if (width >= 700) {
      this.state.setSize('md');
    } else {
      this.state.setSize('xs');
    }
  }

  // -----------------------------------------------------------------
  // Setup Player Data
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
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

  setupTranscriptions(media, defaultLang = LConstants.English) {
    const { transcriptions } = media;

    if (Array.isArray(transcriptions) && transcriptions.length > 0) {
      this.setTranscriptions(transcriptions);
      this.languages = _.map(transcriptions, trans => ({ 
        code: trans.language, 
        text: LConstants.decode(trans.language)
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
      if (this.state.openCC) {
        this.toggleCC();
      }
      return;
    }

    const { id, language, /** src */ } = currTranscription;
    this.setLanguage({ code: language, text: LConstants.decode(language) });

    let captions = await this.getCaptionsByTranscriptionId(id);
    captions = _.map(captions, (cap, index) => ({ ...cap, index }));
    this.setCaptions(captions);
    this.setCurrCaption(null);
    this.updateCurrCaption(this.time);
    // if (!this.state.openCC) this.toggleCC();
  }

  // -----------------------------------------------------------------
  // Event handlers
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  changeLanguage(language) {
    if (!this.state.openCC) this.setOpenCC(true);
    let targetIndex = _.findIndex(this.state.transcriptions, { language });
    if (targetIndex >= 0) {
      this.setLanguage({ code: language, text: (language) });
      this.setCurrTranscription(this.state.transcriptions[targetIndex]);
    } else {
      this.setLanguage({ code: null, text: null });
      this.setCurrTranscription(null);
    }
  }

  // @TODO: Use Binary Search
  findCurrCaption(now, captions) {
    const isCurrent = (item) => {
      if (!item) return false;
      const end = timestr.toSeconds(item.end);
      const begin = timestr.toSeconds(item.begin);
      return begin <= now && now <= end;
    };

    let next = this.state.currCaption;

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

    return next;
  }

  updateCurrCaption(now) {
    if (!this.state.openCC || this.state.captions.length <= 0) return;
    const captions = this.state.captions;
    this.setCurrCaption(this.findCurrCaption(now, captions));
  }

  enterFullscreen() {
    let node = this.playerNode;
    if (!node) return;

    elem.enterFullscreen(node);
  }

  exitFullscreen() {
    elem.exitFullScreen();
  }

  onFullscreenChange(/** event */) {
    this.state.setIsFullscreen(elem.isInFullScreen);
    this.handlePlayerSize();
  }

  onKeyDown(event) {
    _playerKeyDownEventHandler(event, this);
  }

  // -----------------------------------------------------------------
  // Player State/Attribute Setters
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  setScreenMode(screenMode) {
    this.state.setScreenMode(screenMode);
  }

  swapScreens() {
    this.state.setIsSwappedScreen(!this.state.isSwappedScreen);
  }

  setCCFontSize(ccFontSize) {
    this.state.setCCFontSize(ccFontSize);
  }

  setCCFontColor(ccFontColor) {
    this.state.setCCFontColor(ccFontColor);
  }

  setCCOpacity(ccOpacity) {
    this.state.setCCOpacity(ccOpacity);
  }

  setCCBackgroundColor(ccBackgroundColor) {
    this.state.setCCBackgroundColor(ccBackgroundColor);
  }

  setError(error) {
    this.state.setError(error);
  }

  setMedia(media) {
    this.state.setMedia(media);
  }

  setTranscriptions(transcriptions) {
    this.state.setTranscriptions(transcriptions);
  }

  setCurrTranscription(currTranscription) {
    this.state.setCurrTranscription(currTranscription);
  }

  setLanguage(language) {
    this.state.setLanguage(language);
  }

  setCaptions(captions) {
    this.state.setCaptions(captions);
  }

  setCurrCaption(currCaption) {
    this.state.setCurrCaption(currCaption);
  }

  setOpenCC(openCC) {
    this.state.setOpenCC(openCC);
  }
  
  closeCC() {
    this.setOpenCC(false);
  }

  toggleCC() {
    this.setOpenCC(!this.state.openCC);
  }
}

export default PlayerController;