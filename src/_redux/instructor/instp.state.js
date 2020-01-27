import {
  LOADING_INIT
} from '../../screens/Instructor/Utils'

export const initialState = {
  // Sidebar
  sidebar: true,
  offerings: [],
  departments: [],
  terms: [],

  // Course
  offering : [],
  playlists: [],
  playlist: {},
  isEditingOffering: false,

  // Playlist
  isSelectingVideos: false,
  selectedVideos: {},

  // Others
  loading: LOADING_INIT,
  confirmation: null,
  prompt: null,
}