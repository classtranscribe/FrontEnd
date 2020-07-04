import { createReduxStore, createSelector } from '../../redux-creators';
import instPlaylistReducer from './inst-pl.reducers';
import * as instPlaylistActions from './inst-pl.actions';

export const connectWithRedux = createSelector(instPlaylistActions);

export const instPlaylistStore = createReduxStore(instPlaylistReducer);
