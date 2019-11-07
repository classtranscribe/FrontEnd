import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_PLAYLISTS,
  SET_WATCH_HISTORY,
  SET_STARRED_OFFERINGS,
  
  SET_MENU,
  SET_MODE,

  SET_PAUSE,
  SET_TIME,
  SET_VOLUME,
  SET_MUTE,
  SET_PLAYBACKRATE,
  SET_TRANS,
  SWITCH_SCREEN,
  SET_BUFFERED_TIME,
  SET_DURATION,
  SET_FULLSCREEN,
} from './watch.action.types'

const initialState = require('./watch.state.json')

const watchReducer = (
  state=initialState, 
  action
) => {

  const { type, value } = action

  switch (type) {
    // Metadata
    case SET_MEDIA              : return { ...state, media: value}
    case SET_PLAYLIST           : return { ...state, playlist: value }
    case SET_PLAYLISTS          : return { ...state, playlists: value }
    case SET_WATCH_HISTORY      : return { ...state, watchHistory: value }
    case SET_STARRED_OFFERINGS  : return { ...state, starredOfferings: value }

    // Settings
    case SET_MENU               : return { ...state, menu: value }
    case SET_MODE               : return { ...state, mode: value }

    // Players
    case SET_PAUSE              : return { ...state, paused: value }
    case SET_TIME               : return { ...state, time: value }
    case SET_BUFFERED_TIME      : return { ...state, bufferedTime: value }
    case SET_DURATION           : return { ...state, duration: value }
    case SET_PLAYBACKRATE       : return { ...state, playbackrate: value }
    case SET_VOLUME             : return { ...state, volume: value }
    case SET_MUTE               : return { ...state, muted: value }
    case SET_TRANS              : return { ...state, trans: value }
    case SWITCH_SCREEN          : return { ...state, isSwitched: value }
    case SET_FULLSCREEN         : return { ...state, isFullscreen: value }

    // Default
    default                     : return state
  }
}

export default watchReducer