import { createAction } from '../redux-creators';
import {
  SET_ERROR,
  SET_VIEW,
  SET_MEDIA,
  SET_EPUB,
  SET_CHAPTERS,
  SET_CURR_CH_IDX,
  SET_FOLDED_IDS,
  SET_SAVED,
  SET_NAV_ID,
  SET_SHOW_NAV,
  SET_PLAYER_DATA,
  SET_SHOW_PREVIEW,
  SET_SHOW_FILE_SETTINGS,
  SET_SHOW_PREF_SETTINGS,
  RESET_STATES
} from './action.types';

export const setError = createAction(SET_ERROR);
export const setView = createAction(SET_VIEW);
export const setMedia = createAction(SET_MEDIA);

export const setEPub = createAction(SET_EPUB);
export const setChapters = createAction(SET_CHAPTERS);
export const setCurrChIndex = createAction(SET_CURR_CH_IDX);
export const setFoldedIds = createAction(SET_FOLDED_IDS);
export const setSaved = createAction(SET_SAVED);

export const setNavId = createAction(SET_NAV_ID);
export const setShowNav = createAction(SET_SHOW_NAV);

export const setPlayerData = createAction(SET_PLAYER_DATA);
export const setShowPreview = createAction(SET_SHOW_PREVIEW);
export const setShowFileSettings = createAction(SET_SHOW_FILE_SETTINGS);
export const setShowPrefSettings = createAction(SET_SHOW_PREF_SETTINGS);

export const resetStates = createAction(RESET_STATES);
