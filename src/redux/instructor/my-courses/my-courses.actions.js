import {
  SET_TERMS,
  SET_OFFERINGS,
} from './my-courses.action.types';
import { createAction } from '../../redux-creators';

export const setTerms = createAction(SET_TERMS);
export const setOfferings = createAction(SET_OFFERINGS);