import { createAction } from '../redux-creators';
import { SET_MEDIA, SET_PLAYLIST, SET_ERROR } from './msp.action.types';

export const setMedia = createAction(SET_MEDIA);
export const setPlaylist = createAction(SET_PLAYLIST);

export const setError = createAction(SET_ERROR);
