import {
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
  CLEAR_COURSE_DATA
} from './course.action.types';
import { createAction } from '../redux-creators';

export const setOffering = createAction(SET_OFFERING);
export const setPlaylists = createAction(SET_PLAYLISTS);
export const setPlaylist = createAction(SET_PLAYLIST);

export const clearCourseData = createAction(CLEAR_COURSE_DATA);