import { createReduxStore, createSelector } from '../redux-creators';
import homeReducer from './home.reducers';
import * as homeActions from './home.actions';

export const connectWithRedux = createSelector(homeActions);

export const homeStore = createReduxStore(homeReducer);