import { createReduxStore, createSelector } from 'redux/redux-creators';
import epubReducer from './reducer';
import * as epubActions from './actions';

export const epubStore = createReduxStore(epubReducer);
export const connectWithRedux = createSelector(epubActions);
