import {
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
  SET_STARRED_OFF,
  SET_ROLE,
  CLEAR_COURSE_DATA
} from './course.action.types';
import { initialState } from './course.state';

const courseReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_OFFERING:
      return { ...state, offering: value };

    case SET_PLAYLISTS:
      return { ...state, playlists: value };

    case SET_PLAYLIST:
      return { ...state, playlist: value };

    case SET_STARRED_OFF:
      return { ...state, starredOfferings: value };
    
    case SET_ROLE:
      return { ...state, role: value };

    case CLEAR_COURSE_DATA:
      return initialState;

    default:
      return state;
  }
};

export default courseReducer;
