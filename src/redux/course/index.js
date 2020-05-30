import { createReduxStore, createSelector } from '../redux-creators';
import courseReducer from './course.reducers';
import * as courseActions from './course.actions';

export const connectWithRedux = createSelector(courseActions);

export const courseStore = createReduxStore(courseReducer);
