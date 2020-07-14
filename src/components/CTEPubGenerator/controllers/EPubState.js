import { ARRAY_INIT } from 'utils/constants';
import { StateController } from 'utils/state-controller';
import { CTPlayerConstants as PCons } from '../../CTPlayer';
import Constants from './EPubConstants';

export default class EPubState extends StateController {
  constructor() {
    super();
    this.error = null;
    this.step = Constants.EPUB_STEP_SPLIT;
    this.language = PCons.ENGLISH;
    this.rawEpubData = ARRAY_INIT;
    this.chapters = [];
    this.currChIndex = 0;
    this.navId = null;
    this.showNav = false;
    this.magnifiedImg = null;
    this.foldedIds = [];
  }

  init(props) {
    const {
      setError,
      setStep,
      setEpubData,
      setLanguage,
      setChapters,
      setCurrChIndex,
      setNavId,
      setShowNav,
      setMagnifiedImg,
      setFoldedIds
    } = props;

    this.register({
      setError,
      setStep,
      setEpubData,
      setLanguage,
      setChapters,
      setCurrChIndex,
      setNavId,
      setShowNav,
      setMagnifiedImg,
      setFoldedIds
    });
  }

  setError(error) {
    this.setState('setError', 'error', error);
  }

  setLanguage(language) {
    this.setState('setLanguage', 'language', language);
  }

  setRawEpubData(rawEpubData) {
    this.setState('setRawEpubData', 'rawEpubData', rawEpubData);
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
}

export const epubState = new EPubState();