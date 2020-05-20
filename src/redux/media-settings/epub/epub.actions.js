import { createAction } from '../../redux-creators';
import {
  SET_LANGUAGE,
  SET_STEP,
  SET_EPUB_DATA,
  SET_CHAPTERS,
  SET_CURR_CHAPTER,
  SET_MAGNIFIED_IMG,
  SET_FOLDED_IDS,
  SET_NAV_ID,
  SET_SHOW_NAV,
  SET_ERROR,
} from './epub.action.types';

export const setLanguage = createAction(SET_LANGUAGE);
export const setStep = createAction(SET_STEP);

export const setEpubData = createAction(SET_EPUB_DATA);
export const setChapters = createAction(SET_CHAPTERS);
export const setCurrChapter = createAction(SET_CURR_CHAPTER);

export const setMagnifiedImg = createAction(SET_MAGNIFIED_IMG);
export const setFoldedIds = createAction(SET_FOLDED_IDS);

export const setNavId = createAction(SET_NAV_ID);
export const setShowNav = createAction(SET_SHOW_NAV);

export const setError = createAction(SET_ERROR);
