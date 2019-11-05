import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_PLAYLISTS,
  SET_WATCH_HISTORY,
  SET_STARRED_OFFERINGS,
  
  SET_MENU,
  SET_MODE,

  SET_PAUSE,
  SET_VOLUME,
  SET_PLAYBACKRATE,
} from './watch.action.types'

const initialState = require('./watch.state.json')

const watchReducer = (
  state=initialState, 
  action
) => {
  const { type, value } = action
  switch (type) {
    // Metadata
    case SET_MEDIA:
      return {
        ...state,
        media: value
      }
    case SET_PLAYLIST:
      return {
        ...state,
        playlist: value
      }
    case SET_PLAYLISTS:
      return {
        ...state,
        playlists: value
      }
    case SET_WATCH_HISTORY: 
      return {
        ...state,
        watchHistory: value
      }
    case SET_STARRED_OFFERINGS:
      return {
        ...state,
        starredOfferings: value
      }

    // Settings
    case SET_MENU:
      return {
        ...state, 
        menu: value
      }
    case SET_MODE:
      return {
        ...state,
        mode: value
      }

    // Players
    case SET_PLAYBACKRATE:
      return {
        ...state,
        playbackrate: value
      }
    default:
      return state
  }
}

export default watchReducer