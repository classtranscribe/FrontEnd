import { StateController } from 'utils/state-controller';
// import Constants from './EPubConstants';

/**
 * The redux state controller for CTEPubGenerator
 */
class EPubStateManager extends StateController {
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

  setImgPickerData(imgPickerData) {
    this.setState('setImgPickerData', 'imgPickerData', imgPickerData);
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

  setShowShortcuts(showShortcuts) {
    this.setState('setShowShortcuts', 'showShortcuts', showShortcuts);
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