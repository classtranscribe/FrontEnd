import {
  SET_OFFERING,
  SET_PLAYLIST,
  SET_MEDIAS,
  SET_CONFIRMATION,
  CLEAR_PLAYLIST_DATA
} from './inst-pl.action.types';
import { initialState } from './inst-pl.state';

const myCoursesReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_OFFERING:
      return { ...state, offering: value };

    case SET_PLAYLIST:
      return { ...state, playlist: value };

    case SET_MEDIAS:
      return { ...state, medias: value };

    case SET_CONFIRMATION:
      return { ...state, confirmation: value };

    case CLEAR_PLAYLIST_DATA:
      return initialState;

    default:
      return state;
  }
};

export default myCoursesReducer;