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
    this.step = initialState.step;
    this.language = initialState.language;
    this.epub = initialState.epub;
    this.chapters = initialState.chapters;
    this.saved = initialState.saved;
    this.currChIndex = initialState.currChIndex;
    this.navId = initialState.navId;
    this.showNav = initialState.showNav;
    this.playerData = initialState.playerData;

    this.resetStates = this.resetStates.bind(this);
  }

  init(props) {
    const {
      setError,
      setStep,
      setEPub,
      setChapters,
      setCurrChIndex,
      setSaved,
      setNavId,
      setShowNav,
      setPlayerData,
      resetStates
    } = props;

    this.register({
      setError,
      setStep,
      setEPub,
      setChapters,
      setCurrChIndex,
      setSaved,
      setNavId,
      setShowNav,
      setPlayerData,
      resetStates
    });
  }

  setError(error) {
    this.setState('setError', 'error', error);
  }

  setStep(step) {
    this.setState('setStep', 'step', step);
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