import {
  SET_OFFERING,
  SET_PLAYLIST,
  SET_MEDIAS,
  SET_CONFIRMATION,
  CLEAR_PLAYLIST_DATA
} from './inst-pl.action.types';
import { createAction } from '../../redux-creators';

export const setOffering = createAction(SET_OFFERING);
export const setPlaylist = createAction(SET_PLAYLIST);
export const setMedias = createAction(SET_MEDIAS);
export const setConfirmation = createAction(SET_CONFIRMATION);

export const clearData = createAction(CLEAR_PLAYLIST_DATA);