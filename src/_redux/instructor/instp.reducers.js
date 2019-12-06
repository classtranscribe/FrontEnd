import {
  // Course page
  SET_OFFERINGS,
  // Offering page
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
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

    // Offering page
    case SET_OFFERING           : return { ...state, offering: value }
    case SET_PLAYLISTS          : return { ...state, playlists: value }
    case SET_PLAYLIST           : return { ...state, playlist: value }

    // Default
    default                     : return state
  }
}

export default instpReducer