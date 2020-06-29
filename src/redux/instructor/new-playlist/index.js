import { createReduxStore, createSelector } from '../../redux-creators';
import newPlayListReducer from './new-playlist.reducers';
import * as newPlayListActions from './new-playlist.action';

export const connectWithRedux = createSelector(newPlayListActions);

export const newPlayListStore = createReduxStore(newPlayListReducer);
