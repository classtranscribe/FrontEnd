import {
  LOADING_INIT, ARRAY_INIT
} from '../../screens/Instructor/Utils'

export const initialState = {
  // Sidebar
  sidebar: true,
  offerings: ARRAY_INIT,
  departments: [],
  terms: [],

  // Course
  offering : {},
  playlists: [],
  playlist: {},
  isEditingOffering: false,
  isViewingAnalytics: false,

  // Playlist
  isSelectingVideos: false,
  selectedVideos: {},

  // Others
  loading: LOADING_INIT,
  confirmation: null,
  prompt: null,
}