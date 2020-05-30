import {
  SET_COURSE_OFFERING,
  SET_COURSE_PLAYLISTS,
  SET_COURSE_PLAYLIST
} from './course.action.types';
import { createAction } from '../redux-creators';

export const setOffering = createAction(SET_COURSE_OFFERING);
export const setPlaylists = createAction(SET_COURSE_PLAYLISTS);
export const setPlaylist = createAction(SET_COURSE_PLAYLIST);