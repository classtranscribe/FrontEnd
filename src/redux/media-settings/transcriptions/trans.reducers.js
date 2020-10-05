import {
  SET_TRANSCRIPTIONS,
  SET_VIDEO_TIME,
  SET_LANGUAGE
} from './trans.action.types';
import { initialState } from './trans.state';

const transReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };
    case SET_VIDEO_TIME:
      return { ...state, videoTime: value };
    case SET_LANGUAGE:
      return { ...state, language: value };
    default:
      return state;
  }
};

export default transReducer;