import { createReduxStore, createSelector } from '../../redux-creators';
import myCoursesReducer from './my-courses.reducers';
import * as myCoursesActions from './my-courses.actions';

export const connectWithRedux = createSelector(myCoursesActions);

export const myCoursesStore = createReduxStore(myCoursesReducer);
