import {
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
  SET_STARRED_OFF,
  SET_ROLE,
  SET_IS_INST_MODE,
  CLEAR_COURSE_DATA
} from './course.action.types';
import { createAction } from '../redux-creators';

export const setOffering = createAction(SET_OFFERING);
export const setPlaylists = createAction(SET_PLAYLISTS);
export const setPlaylist = createAction(SET_PLAYLIST);
export const setStarredOfferings = createAction(SET_STARRED_OFF);
export const setRole = createAction(SET_ROLE);
export const setIsInstMode = createAction(SET_IS_INST_MODE);

export const clearCourseData = createAction(CLEAR_COURSE_DATA);