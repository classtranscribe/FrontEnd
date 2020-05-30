import { createReduxStore, createSelector } from '../redux-creators';
import searchReducer from './search.reducers';
import * as searchActions from './search.actions';

export const connectWithRedux = createSelector(searchActions);

export const searchStore = createReduxStore(searchReducer);
