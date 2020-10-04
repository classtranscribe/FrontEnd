import _ from 'lodash';
import { isSafari } from 'react-device-detect';
import { api, elem, timestr } from 'utils';
import PConstants from './constants/PlayerConstants';
import LConstants from './constants/LanguageConstants';
import VideoController from './VideoController';
import CaptionStyle from './structs/CaptionStyle';
import PPrefer from './PlayerPreference';
import _playerKeyDownEventHandler from './keydown-handler';
import { _findCurrTimeBlock } from './helpers';

/**
 * The video player controller
 */
class PlayerController extends VideoController {
  /**
   * Create a CTPlayer controller
   * @param {Any} stateManager - a state manager for video controller
   */
  constructor(stateManager, id) {
    super(stateManager, id);

    // Node of the player
    this.playerNode = null;
    // Init userActive event values
    this.userActiveTimer = null;
    this.hideWrapperOnMouseLeave = false;
    // Languages for current media
    this.languages = [];

    this.isSwappedScreen = false;

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
    this.handlePlayerSize = this.handlePlayerSize.bind(this);

    this.setCCFontSize = this.setCCFontSize.bind(this);
    this.setCCFontColor = this.setCCFontColor.bind(this);
    this.setCCOpacity = this.setCCOpacity.bind(this);
    this.setCCBackgroundColor = this.setCCBackgroundColor.bind(this);

    this.__onFullscreenChange = this.__onFullscreenChange.bind(this);
    this.__onKeyDown = this.__onKeyDown.bind(this);
    this.__onMouseEnter = this.__onMouseEnter.bind(this);
    this.__onMouseMove = this.__onMouseMove.bind(this);
    this.__onMouseLeave = this.__onMouseLeave.bind(this);
    this.__onFocusIn = this.__onFocusIn.bind(this);
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
    if (!node) {
      console.error('Failed to register node for player element.')
      return;
    }

    this.playerNode = node;
    // add event listeners
    node.addEventListener('keydown', this.__onKeyDown);
    // handle user active events
    node.addEventListener('mouseenter', this.__onMouseEnter);
    node.addEventListener('mousemove', this.__onMouseMove);
    node.addEventListener('mouseleave', this.__onMouseLeave);
    node.addEventListener('focusin', this.__onFocusIn);
    if (isSafari) {
      node.addEventListener('webkitfullscreenchange', this.__onFullscreenChange);
    } else {
      node.addEventListener('fullscreenchange', this.__onFullscreenChange);
    }
    this.handlePlayerSize();
  }

  get playerBoundingRect() {
    return this.playerNode.getBoundingClientRect();
  }

  handlePlayerSize() {
    if (!this.playerNode) return;
    const { width } = this.playerBoundingRect;
    if (width >= 1000) {
      this.state.setSize(PConstants.PlayerSizeLarge);
    } else if (width >= 700) {
      this.state.setSize(PConstants.PlayerSizeMedium);
    } else {
      this.state.setSize(PConstants.PlayerSizeSmall);
    }
  }

  focusOnPlayer() {
    this.playerNode.focus();
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
      return _.map(data, (caption, index) => ({ ...caption, index }));
    } catch (error) {
      return [];
    }
  }

  setupTranscriptions(media, defaultLang = PPrefer.language) {
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

    const captions = await this.getCaptionsByTranscriptionId(id);
    // console.log('captions', captions);
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

  findCurrCaptionBS(now, captions) {
    let next = this.state.currCaption;

    // if it's the first time to find captions
    if (!next) {
      next = _findCurrTimeBlock(captions, now) || next;

      // if looking for caption that is after the current one
    } else if (now > timestr.toSeconds(next.begin)) {
      next = _findCurrTimeBlock(captions, now, next.index + 1) || next;

      // if looking for caption that is prior to the current one
    } else if (now < timestr.toSeconds(next.end)) {
      next = _findCurrTimeBlock(captions, now, 0, next.index - 1) || next;
    }

    return next;
  }

  findCurrCaption(now, captions) {
    const _isCurrentCap = (item) => {
      if (!item) return false;
      const end = timestr.toSeconds(item.end);
      const begin = timestr.toSeconds(item.begin);
      return begin <= now && now <= end;
    };

    let next = this.state.currCaption;

    // if it's the first time to find captions
    if (!next) {
      next = _.find(captions, _isCurrentCap) || next;

      // if looking for caption that is after the current one
    } else if (now > timestr.toSeconds(next.begin)) {
      next = _.find(captions, _isCurrentCap, next.index + 1) || next;

      // if looking for caption that is prior to the current one
    } else if (now < timestr.toSeconds(next.end)) {
      next = _.findLast(captions, _isCurrentCap, next.index - 1) || next;
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

  __onFullscreenChange(/** event */) {
    this.state.setIsFullscreen(elem.isInFullScreen);
    this.handlePlayerSize();
  }

  __onKeyDown(event) {
    _playerKeyDownEventHandler(event, this);
  }

  __onMouseEnter() {
    this.state.setUserActive(true);
  }

  __onMouseMove() {
    if (this.userActiveTimer !== null) {
      clearTimeout(this.userActiveTimer);
      this.userActiveTimer = null;
    }
    
    if (!this.state.userActive) {
      this.state.setUserActive(true);
    }

    this.userActiveTimer = setTimeout(() => {
      this.state.setUserActive(false);
      this.userActiveTimer = null;
    }, 3000);
  }

  __onMouseLeave() {
    if (this.hideWrapperOnMouseLeave) {
      this.state.setUserActive(false);
    }
  }

  __onFocusIn() {
    this.__onMouseMove();
  }

  // -----------------------------------------------------------------
  // Player State/Attribute Setters
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  setError(error) {
    this.state.setError(error);
  }

  // Screen Settings
  // -----------------------------------------------------------------
  setScreenMode(screenMode) {
    this.state.setScreenMode(screenMode);
    PPrefer.setScreenMode(screenMode);
  }

  swapScreens() {
    this.isSwappedScreen = !this.state.isSwappedScreen
    this.state.setIsSwappedScreen(!this.state.isSwappedScreen);
  }

  // Media/Transcription Data
  // -----------------------------------------------------------------
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
    PPrefer.setLanguage(language.code);
  }

  setCaptions(captions) {
    this.state.setCaptions(captions);
  }

  setCurrCaption(currCaption) {
    this.state.setCurrCaption(currCaption);
  }

  // Closed Caption Settings
  // -----------------------------------------------------------------
  setOpenCC(openCC) {
    this.state.setOpenCC(openCC);
    PPrefer.setOpenCC(openCC);
  }
  
  closeCC() {
    this.setOpenCC(false);
  }

  toggleCC() {
    this.setOpenCC(!this.state.openCC);
  }

  setCCStyle(ccStyle) {
    const newStyle = { ...this.state.ccStyle, ...ccStyle };
    this.state.setCCStyle(newStyle);
    CaptionStyle.setPreference(newStyle);
  }

  setCCFontSize(fontSize) {
    this.setCCStyle({ fontSize });
  }

  setCCFontColor(fontColor) {
    this.setCCStyle({ fontColor });
  }

  setCCOpacity(opacity) {
    this.setCCStyle({ opacity });
  }

  setCCBackgroundColor(backgroundColor) {
    this.setCCStyle({ backgroundColor });
  }

  setCCPosition(position) {
    this.setCCStyle({ position });
  }
}

export default PlayerController;