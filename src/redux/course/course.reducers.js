import {
  SET_COURSE_OFFERING,
  SET_COURSE_PLAYLISTS,
  SET_COURSE_PLAYLIST
} from './course.action.types';
import { initialState } from './course.state';

const courseReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_COURSE_OFFERING:
      return { ...state, offering: value };

    case SET_COURSE_PLAYLISTS:
      return { ...state, playlists: value };

    case SET_COURSE_PLAYLIST:
      return { ...state, playlist: value };

    default:
      return state;
  }
};

export default courseReducer;
