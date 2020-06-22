import { SET_NAME, SET_TYPE } from './new-playlist.action.types';
import { createAction } from '../../redux-creators';

export const setName = createAction(SET_NAME);
export const setType = createAction(SET_TYPE);
