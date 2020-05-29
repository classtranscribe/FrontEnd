import {
  SET_WATCH_HISTORIES
} from './history.action.types';
import { initialState } from './history.state';

const historyReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_WATCH_HISTORIES:
      return { ...state, watchHistories: value };
    // Default
    default:
      return state;
  }
};

export default historyReducer;
