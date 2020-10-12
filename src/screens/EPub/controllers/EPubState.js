import { StateController } from 'utils/state-controller';
import { initialState } from './init-state';
// import Constants from './EPubConstants';

/**
 * The redux state controller for CTEPubGenerator
 */
export default class EPubState extends StateController {
  constructor() {
    super();

    this.error = initialState.error;
    this.step = initialState.step;
    this.language = initialState.language;
    this.rawEPubData = initialState.rawEPubData;
    this.epubs = initialState.epubs;
    this.currEPub = initialState.currEPub;
    this.chapters = initialState.chapters;
    this.currChIndex = initialState.currChIndex;
    this.navId = initialState.navId;
    this.showNav = initialState.showNav;
    this.magnifiedImg = initialState.magnifiedImg;
    this.ePubItemId = initialState.ePubItemId;
    this.playerData = initialState.playerData;
    this.foldedIds = initialState.foldedIds;

    this.resetStates = this.resetStates.bind(this);
  }

  init(props) {
    const {
      setError,
      setStep,
      setLanguage,
      setRawEPubData,
      setEPubs,
      setCurrEPub,
      setChapters,
      setCurrChIndex,
      setNavId,
      setShowNav,
      setMagnifiedImg,
      setEPubItemId,
      setPlayerData,
      setFoldedIds,
      resetStates
    } = props;

    this.register({
      setError,
      setStep,
      setLanguage,
      setRawEPubData,
      setEPubs,
      setCurrEPub,
      setChapters,
      setCurrChIndex,
      setNavId,
      setShowNav,
      setMagnifiedImg,
      setEPubItemId,
      setPlayerData,
      setFoldedIds,
      resetStates
    });
  }

  setError(error) {
    this.setState('setError', 'error', error);
  }

  setStep(step) {
    this.setState('setStep', 'step', step);
  }

  setLanguage(language) {
    this.setState('setLanguage', 'language', language);
  }

  setRawEPubData(rawEPubData) {
    this.setState('setRawEPubData', 'rawEPubData', rawEPubData);
  }

  setEPubs(epubs) {
    this.setState('setEPubs', 'epubs', epubs);
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

  setNavId(navId) {
    this.setState('setNavId', 'navId', navId);
  }

  setMagnifiedImg(magnifiedImg) {
    this.setState('setMagnifiedImg', 'magnifiedImg', magnifiedImg);
  }

  setEPubItemId(ePubItemId) {
    this.setState('setEPubItemId', 'ePubItemId', ePubItemId);
  }

  setPlayerData(playerData) {
    this.setState('setPlayerData', 'playerData', playerData);
  }

  setFoldedIds(foldedIds) {
    this.setState('setFoldedIds', 'foldedIds', foldedIds);
  }

  setShowNav(showNav) {
    this.setState('setShowNav', 'showNav', showNav);
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

export const epubState = new EPubState();