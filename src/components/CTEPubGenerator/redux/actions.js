import { createAction } from 'redux/redux-creators';
import {
  SET_ERROR,
  SET_STEP,
  SET_LANGUAGE,
  SET_RAW_EPUB_DATA,
  SET_EPUBS,
  SET_CURR_EPUB_IDX,
  SET_CHAPTERS,
  SET_CURR_CH_IDX,
  SET_NAV_ID,
  SET_SHOW_NAV,
  SET_MAGNIFIED_IMG,
  SET_EPUB_ITEM_ID,
  SET_PLAYER_DATA,
  SET_FOLDED_IDS,
  RESET_STATES
} from './action.types';

export const setError = createAction(SET_ERROR);
export const setStep = createAction(SET_STEP);
export const setLanguage = createAction(SET_LANGUAGE);

export const setRawEPubData = createAction(SET_RAW_EPUB_DATA);
export const setEPubs = createAction(SET_EPUBS);
export const setCurrEPubIndex = createAction(SET_CURR_EPUB_IDX);
export const setChapters = createAction(SET_CHAPTERS);
export const setCurrChIndex = createAction(SET_CURR_CH_IDX);

export const setNavId = createAction(SET_NAV_ID);
export const setShowNav = createAction(SET_SHOW_NAV);

export const setMagnifiedImg = createAction(SET_MAGNIFIED_IMG);
export const setEPubItemId = createAction(SET_EPUB_ITEM_ID);
export const setPlayerData = createAction(SET_PLAYER_DATA);
export const setFoldedIds = createAction(SET_FOLDED_IDS);

export const resetStates = createAction(RESET_STATES);
