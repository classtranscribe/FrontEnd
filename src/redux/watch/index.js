import { createReduxStore, createSelector } from '../redux-creators';
import watchReducer from './watch.reducers';
import * as watchActions from './watch.actions';

export const connectWithRedux = createSelector(watchActions, {
  defaultRequestedStates: ['media', 'playlist', 'playlists'],
  defaultRequestedDispatches: ['setMedia', 'setPlaylist', 'setPlaylists'],
});

export const watchStore = createReduxStore(watchReducer);
