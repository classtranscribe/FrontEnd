import { createAction } from 'redux/redux-creators';
import {
  SET_COURSE_NUM,
  SET_COURSE_NAME,
  SET_TERM,
  SET_SECTION_NAME,
  SET_ACCESS_TYPE,
  SET_DESCRIPTION,
  SET_LOG_EVENT,
} from './new-course.action.types';

export const setCourseNum = createAction(SET_COURSE_NUM);
export const setCourseName = createAction(SET_COURSE_NAME);
export const setTerm = createAction(SET_TERM);
export const setSectionName = createAction(SET_SECTION_NAME);
export const setAccessType = createAction(SET_ACCESS_TYPE);
export const setDescription = createAction(SET_DESCRIPTION);
export const setLogEvent = createAction(SET_LOG_EVENT);