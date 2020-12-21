import {
  SET_OFFERINGS,
  SET_SEARCH_VAL,
  SET_SEARCH_RES,
  SET_RES
} from './search.action.types';
import { createAction } from '../redux-creators';

export const setOfferings = createAction(SET_OFFERINGS);
export const setSearchValue = createAction(SET_SEARCH_VAL);
export const setSearchResult = createAction(SET_SEARCH_RES);
export const setResult = createAction(SET_RES);