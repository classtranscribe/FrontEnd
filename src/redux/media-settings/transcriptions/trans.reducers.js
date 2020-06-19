import {
  SET_TRANSCRIPTIONS
} from './trans.action.types';
import { initialState } from './trans.state';

const transReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TRANSCRIPTIONS:
      return { ...state, transcriptions: value };

    default:
      return state;
  }
};

export default transReducer;