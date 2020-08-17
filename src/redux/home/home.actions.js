import { createAction } from '../redux-creators';
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

export const setError = createAction(SET_ERROR);
export const setUniversities = createAction(SET_UNIVERSITIES);
export const setTerms = createAction(SET_TERMS);
export const setDepartments = createAction(SET_DEPARTMENTS);
export const setSelUniversity = createAction(SET_SEL_UNIVERSITY);
export const setSelDepartments = createAction(SET_SEL_DEPARTMENTS);
export const setSelTerms = createAction(SET_SEL_TERMS);

export const setStarredOfferings = createAction(SET_STARRED_OFFS);
export const setWatchHistory = createAction(SET_WATCH_HISTORY);
export const setOfferings = createAction(SET_OFFS);
export const setSections = createAction(SET_SECTIONS);