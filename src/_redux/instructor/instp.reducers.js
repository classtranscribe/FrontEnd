import {
  // Course page
  SET_OFFERINGS,
  SET_DEPARTS,
  SET_TERMS,
  // Offering page
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
  // others
  SET_SIDEBAR,
} from './instp.action.types'
import { initialState } from './instp.state'

const instpReducer = (
  state=initialState, 
  action
) => {

  const { type, value } = action

  switch (type) {
    // Courses page
    case SET_OFFERINGS          : return { ...state, offerings: value }
    case SET_DEPARTS            : return { ...state, departments: value }
    case SET_TERMS              : return { ...state, terms: value }

    // Offering page
    case SET_OFFERING           : return { ...state, offering: value }
    case SET_PLAYLISTS          : return { ...state, playlists: value }
    case SET_PLAYLIST           : return { ...state, playlist: value }

    // Others
    case SET_SIDEBAR            : return { ...state, sidebar: value }

    // Default
    default                     : return state
  }
}

export default instpReducer