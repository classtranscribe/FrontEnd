import {
  SET_ERROR,
  SET_UNIVERSITIES,
  SET_TERMS,
  SET_DEPARTMENTS,
  SET_SEL_UNIVERSITY,
  SET_SEL_DEPARTMENTS,
  SET_SEL_TERMS,
  SET_STARRED_OFFS,
  SET_WATCH_HISTORY,
  SET_OFFS,
  SET_SECTIONS
} from './home.action.types';
import { initialState } from './home.state';

const homeReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_ERROR:
      return { ...state, error: value };
      
    case SET_UNIVERSITIES:
      return { ...state, universities: value };
    case SET_TERMS:
      return { ...state, terms: value };
    case SET_DEPARTMENTS:
      return { ...state, departments: value };
    case SET_SEL_UNIVERSITY:
      return { ...state, selUniversity: value };
    case SET_SEL_DEPARTMENTS:
      return { ...state, selDepartments: value };
    case SET_SEL_TERMS:
      return { ...state, selTerms: value };

    case SET_STARRED_OFFS:
      return { ...state, starredOfferings: value };
    case SET_WATCH_HISTORY:
      return { ...state, watchHistory: value };
    case SET_OFFS:
      return { ...state, offerings: value };
    case SET_SECTIONS:
      return { ...state, sections: value };

    // Default
    default:
      return state;
  }
};

export default homeReducer;