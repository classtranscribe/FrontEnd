import {
  SET_OFFERINGS,
  SET_SEARCH_VAL,
  SET_SEARCH_RES,
  SET_RES
} from './search.action.types';
import { initialState } from './search.state';

const searchReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_OFFERINGS:
      return { ...state, offerings: value };
    case SET_SEARCH_VAL:
      return { ...state, searchValue: value };
    case SET_SEARCH_RES:
      return { ...state, searchResult: value };
    case SET_RES:
      return { ...state, result: value };
    // Default
    default:
      return state;
  }
};

export default searchReducer;
