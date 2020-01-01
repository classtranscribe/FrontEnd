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
  // Playlist
  SET_PLAYLIST,
  SET_IS_SELECTING_VIDEOS,
  SET_SELECTED_VIDEOS,
} from './instp.action.types'
import { initialState } from './instp.state'

const instpReducer = (
  state=initialState, 
  action
) => {

  const { type, value } = action

  switch (type) {
    // Sidebar
    case SET_SIDEBAR              : return { ...state, sidebar: value }
    case SET_OFFERINGS            : return { ...state, offerings: value }
    case SET_DEPARTS              : return { ...state, departments: value }
    case SET_TERMS                : return { ...state, terms: value }

    // Course
    case SET_OFFERING             : 
      return { 
        ...state, 
        offering: value, 
        isSelectingVideos: false, 
        selectedVideos: {},
        isEditingOffering: false,
      }
    case SET_PLAYLISTS            : return { ...state, playlists: value }
    case SET_IS_EDITING_OFFERING  : return { ...state, isEditingOffering: value }

    // Playlist
    case SET_PLAYLIST             : 
      return { 
        ...state, 
        playlist: value, 
        isSelectingVideos: false, 
        selectedVideos: {},
        isEditingOffering: false,
      }  
    case SET_IS_SELECTING_VIDEOS  : return { ...state, isSelectingVideos: value }  
    case SET_SELECTED_VIDEOS      : return { ...state, selectedVideos: value }  

    // Default
    default                       : return state
  }
}

export default instpReducer