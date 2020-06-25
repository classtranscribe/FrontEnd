import {
  SET_OFFERING,
  SET_PLAYLIST,
  SET_MEDIAS,
} from './inst-pl.action.types';
import { createAction } from '../../redux-creators';

export const setOffering = createAction(SET_OFFERING);
export const setPlaylist = createAction(SET_PLAYLIST);
export const setMedias = createAction(SET_MEDIAS);