import { createReduxStore, createSelector } from '../redux-creators';
import newCourseReducer from './new-course.reducers';
import * as newCourseActions from './new-course.actions';

export const connectWithRedux = createSelector(newCourseActions);

export const newCourseStore = createReduxStore(newCourseReducer);
