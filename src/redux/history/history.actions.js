import {
  SET_WATCH_HISTORIES
} from './history.action.types';
import { createAction } from '../redux-creators';

export const setWatchHistories = createAction(SET_WATCH_HISTORIES);