import { SET_NAME, SET_TYPE } from './new-playlist.action.types';
import { initialState } from './new-playlist.state';

const newPlaylistReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_NAME:
      return { ...state, name: value };

    case SET_TYPE:
      return { ...state, type: value };

    default:
      return state;
  }
};

export default newPlaylistReducer;
