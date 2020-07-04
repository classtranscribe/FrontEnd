import { createReduxStore, createSelector } from '../redux-creators';
import exampleReducer from './example.reducers';
import * as exampleActions from './example.actions';

export const connectWithRedux = createSelector(exampleActions);

export const exampleStore = createReduxStore(exampleReducer);
