import {
  SET_TERMS,
  SET_OFFERINGS,
} from './my-courses.action.types';
import { initialState } from './my-courses.state';

const myCoursesReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_TERMS:
      return { ...state, terms: value };

    case SET_OFFERINGS:
      return { ...state, offerings: value };

    default:
      return state;
  }
};

export default myCoursesReducer;