import { createReduxStore, createSelector } from '../redux-creators';
import historyReducer from './history.reducers';
import * as historyActions from './history.actions';

export const connectWithRedux = createSelector(historyActions);

export const historyStore = createReduxStore(historyReducer);
