import { api, util, ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils';
import { parseEpubData } from './util';

import {
  NO_EPUB,
  EPUB_DEFAULT_STEP,
  EPUB_STEP_SPLIT,
  EPUB_STEP_EDIT,
  EPUB_STEP_DOWNLOAD,
} from './constants';

class EpubState {
  constructor() {
    this.mediaId = '';
    this.redux = {};
    this.setStateFunc = {};

    this.init = this.init.bind(this);
    this.setupEpub = this.setupEpub.bind(this);
    this.changeChapter = this.changeChapter.bind(this);
    this.updateEpubChapters = this.updateEpubChapters.bind(this);
  }

  /**
   * Function used to register redux functions for epub settings
   * @param {Object} props
   */
  init(props) {
    const {
      setEpubData,
      setIsManagingChapters,
      setLanguage,
      setChapters,
      setCurrChapter,
      setCoverImgs,
      setMagnifiedImg,
      setFoldedIds,
      setNavId,
      setShowNav,
      setError,
      setStep,
    } = props;

    this.redux = {
      ...this.redux,
      setEpubData,
      setIsManagingChapters,
      setLanguage,
      setChapters,
      setCurrChapter,
      setCoverImgs,
      setMagnifiedImg,
      setFoldedIds,
      setNavId,
      setShowNav,
      setError,
      setStep,
    };

    this.setStep(EPUB_DEFAULT_STEP);
    this.setEpubData(ARRAY_INIT);
  }

  setState(funcName, stateName, value) {
    const setState = this.redux[funcName];
    if (setState) {
      setState(value);
      this[stateName] = value;
    }
  }

  error = null;
  setError(error) {
    this.setState('setError', 'error', error);
  }

  step = EPUB_DEFAULT_STEP;
  setStep(step) {
    this.setState('setStep', 'step', step);
  }

  toStep(step) {
    util.links.setHash(step);
  }

  get isStep1() {
    return this.step === EPUB_STEP_SPLIT;
  }

  get isStep2() {
    return this.step === EPUB_STEP_EDIT;
  }

  get isStep3() {
    return this.step === EPUB_STEP_DOWNLOAD;
  }

  epubData = ARRAY_INIT;
  setEpubData(epubData) {
    this.setState('setEpubData', 'epubData', epubData);
  }

  currChapter = {};
  setCurrChapter(currChapter) {
    this.setState('setCurrChapter', 'currChapter', currChapter);
  }

  changeChapter(chapter) {
    this.setCurrChapter(chapter);
  }

  chapters = ARRAY_INIT;
  setChapters(chapters) {
    this.setState('setChapters', 'chapters', chapters);
  }

  updateEpubChapters(chapters, currChapter) {
    this.setChapters([...chapters]);
    this.changeChapter({ ...currChapter });
  }

  language = ENGLISH;
  setLanguage(language) {
    this.setState('setLanguage', 'language', language);
  }

  coverImgs = [];
  setCoverImgs(coverImgs) {
    this.setState('setCoverImgs', 'coverImgs', coverImgs);
  }

  magnifiedImg = null;
  setMagnifiedImg(magnifiedImg) {
    this.setState('setMagnifiedImg', 'magnifiedImg', magnifiedImg);
  }

  foldedIds = [];
  setFoldedIds(foldedIds) {
    this.setState('setFoldedIds', 'foldedIds', foldedIds);
  }

  navId = '';
  setNavId(navId) {
    this.setState('setNavId', 'navId', navId);
  }

  showNav = false;
  setShowNav(showNav) {
    this.setState('setShowNav', 'showNav', showNav);
  }

  async changeEpubLanguage(language) {
    this.setEpubData(ARRAY_INIT);
    let epubData = await this.getEpubData(this.mediaId, language);
    this.setEpubData(epubData);
  }

  async requestEpub(mediaId) {
    try {
      await api.requestEpubCreation(mediaId);
    } catch (error) {
      console.error(`Failed to request a epub for ${mediaId}`);
    }
  }

  async getEpubData(mediaId, language) {
    this.setError('');
    try {
      let { data = [] } = await api.getEpubData(mediaId, language);
      return parseEpubData(data);
    } catch (error) {
      console.error(`Failed to get ePub data of media for ${mediaId}`);
      this.setError(NO_EPUB);
    }

    return ARRAY_INIT;
  }

  async setupEpub(mediaId) {
    this.mediaId = mediaId;
    let epubData = await this.getEpubData(mediaId);
    this.setEpubData(epubData);
  }
}

export const epubState = new EpubState();
