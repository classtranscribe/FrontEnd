import {
  // Sidebar
  SET_SIDEBAR,
  SET_OFFERINGS,
  SET_DEPARTS,
  SET_TERMS,
  // Course
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_IS_EDITING_OFFERING,
  SET_IS_VIEWING_ANALYTICS,
  // Playlist
  SET_PLAYLIST,
  SET_IS_SELECTING_VIDEOS,
  SET_SELECTED_VIDEOS,
  // Others
  SET_LOADING,
  SET_CONFIRMATION,
  SET_ORDERING,
} from './instp.action.types';
import { createAction } from '../redux-creators';

// Sidebar
export const setSidebar = createAction(SET_SIDEBAR);
export const setOfferings = createAction(SET_OFFERINGS);
export const setDeparts = createAction(SET_DEPARTS);
export const setTerms = createAction(SET_TERMS);

// Course
export const setOffering = createAction(SET_OFFERING);
export const setPlaylists = createAction(SET_PLAYLISTS);
export const setIsEditingOffering = createAction(SET_IS_EDITING_OFFERING);
export const setIsViewingAnalytics = createAction(SET_IS_VIEWING_ANALYTICS);

// Playlist
export const setPlaylist = createAction(SET_PLAYLIST);
export const setIsSelectingVideos = createAction(SET_IS_SELECTING_VIDEOS);
export const setSelectedVideos = createAction(SET_SELECTED_VIDEOS);

// Others
export const setLoading = createAction(SET_LOADING);
export const setConfirmation = createAction(SET_CONFIRMATION);
export const setOrdering = createAction(SET_ORDERING);
