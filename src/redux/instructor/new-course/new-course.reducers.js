import {
  SET_COURSE_NUM,
  SET_COURSE_NAME,
  SET_TERM,
  SET_SECTION_NAME,
  SET_ACCESS_TYPE,
  SET_DESCRIPTION,
  SET_LOG_EVENT,
} from './new-course.action.types';
import { initialState } from './new-course.state.js';

const newCourseReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_COURSE_NUM:
      return { ...state, courseNumber: value };
    case SET_COURSE_NAME:
      return { ...state, courseName: value };
    case SET_TERM:
      return { ...state, term: value };
    case SET_SECTION_NAME:
      return { ...state, sectionName: value };
    case SET_ACCESS_TYPE:
      return { ...state, accessType: value };
    case SET_DESCRIPTION:
      return { ...state, description: value };
    case SET_LOG_EVENT:
      return { ...state, logEvent: value };

    default:
      return state;
  }
};

export default newCourseReducer;
