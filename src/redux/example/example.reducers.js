import {
  SET_OFFERINGS
} from './example.action.types';
import { initialState } from './example.state.js';

const exampleReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_OFFERINGS:
      return { ...state, offerings: value };

    default:
      return state;
  }
};

export default exampleReducer;
