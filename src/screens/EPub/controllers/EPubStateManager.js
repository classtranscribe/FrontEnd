import { StateController } from 'utils/state-controller';
import { initialState } from './constants/init-states';
// import Constants from './EPubConstants';

/**
 * The redux state controller for CTEPubGenerator
 */
class EPubStateManager extends StateController {
  constructor() {
    super();

    this.error = initialState.error;
    this.view = initialState.view;
    this.media = initialState.media;
    this.language = initialState.language;
    this.epub = initialState.epub;
    this.chapters = initialState.chapters;
    this.foldedIds = initialState.foldedIds;
    this.saved = initialState.saved;
    this.currChIndex = initialState.currChIndex;
    this.navId = initialState.navId;
    this.showNav = initialState.showNav;
    this.playerData = initialState.playerData;
    this.showPreview = initialState.showPreview;
    this.showFileSettings = initialState.showFileSettings;
    this.showPrefSettings = initialState.showPrefSettings;

    this.resetStates = this.resetStates.bind(this);
  }

  init(props) {
    const {
      setError,
      setView,
      setMedia,
      setEPub,
      setChapters,
      setCurrChIndex,
      setFoldedIds,
      setSaved,
      setNavId,
      setShowNav,
      setPlayerData,
      setShowPreview,
      setShowFileSettings,
      setShowPrefSettings,
      resetStates
    } = props;

    this.register({
      setError,
      setView,
      setMedia,
      setEPub,
      setChapters,
      setCurrChIndex,
      setFoldedIds,
      setSaved,
      setNavId,
      setShowNav,
      setPlayerData,
      setShowPreview,
      setShowFileSettings,
      setShowPrefSettings,
      resetStates
    });
  }

  setError(error) {
    this.setState('setError', 'error', error);
  }

  setView(view) {
    this.setState('setView', 'view', view);
  }

  setMedia(media) {
    this.setState('setMedia', 'media', media);
  }

  setEPub(epub) {
    this.setState('setEPub', 'epub', epub);
  }

  setCurrEPub(currEPub) {
    this.setState('setCurrEPub', 'currEPub', currEPub);
  }

  setChapters(chapters) {
    this.setState('setChapters', 'chapters', chapters);
  }

  setCurrChIndex(currChIndex) {
    this.setState('setCurrChIndex', 'currChIndex', currChIndex);
  }

  setFoldedIds(foldedIds) {
    this.setState('setFoldedIds', 'foldedIds', foldedIds)
  }

  setSaved(saved) {
    this.setState('setSaved', 'saved', saved);
  }

  setNavId(navId) {
    this.setState('setNavId', 'navId', navId);
  }

  setPlayerData(playerData) {
    this.setState('setPlayerData', 'playerData', playerData);
  }

  setShowNav(showNav) {
    this.setState('setShowNav', 'showNav', showNav);
  }

  setShowPreview(showPreview) {
    this.setState('setShowPreview', 'showPreview', showPreview);
  }

  setShowFileSettings(showFileSettings) {
    this.setState('setShowFileSettings', 'showFileSettings', showFileSettings);
  }
  
  setShowPrefSettings(showPrefSettings) {
    this.setState('setShowPrefSettings', 'showPrefSettings', showPrefSettings);
  }

  updateContentChanges(chapters, currChIndex) {
    this.setChapters(chapters);
    this.setCurrChIndex(currChIndex);
  }

  resetStates() {
    const { resetStates } = this.dispatches;
    if (resetStates) {
      resetStates();
    }
  }
}

export default EPubStateManager;
export const epubState = new EPubStateManager();