import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_PLAYLISTS,
  SET_CURR_TRANS,
  SET_TRANSCPTIONS,
  SET_CAPTIONS,
  SET_WATCH_HISTORY,
  SET_STARRED_OFFERINGS,
  // Screen Options
  SET_MENU,
  SET_MODE,
  // Player Options
  SET_PAUSE,
  SET_TIME,
  SET_VOLUME,
  SET_MUTE,
  SET_PLAYBACKRATE,
  SWITCH_SCREEN,
  SET_BUFFERED_TIME,
  SET_DURATION,
  SET_FULLSCREEN,
  // CC Options
  CC_COLOR,
  CC_BG,
  CC_OPACITY,
  CC_SIZE,
  CC_FONT,
  CC_POSITION,
} from './watch.action.types'
import { initialState } from './watch.state'

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
    case SET_TRANSCPTIONS       : return { ...state, transcriptions: value }
    case SET_CURR_TRANS         : return { ...state, currTrans: value }
    case SET_CAPTIONS           : return { ...state, captions: value }
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
    case SWITCH_SCREEN          : return { ...state, isSwitched: value }
    case SET_FULLSCREEN         : return { ...state, isFullscreen: value }

    // CC Options
    case CC_COLOR               : return { ...state, cc_color: value }
    case CC_BG                  : return { ...state, cc_bg: value }
    case CC_OPACITY             : return { ...state, cc_opacity: value }
    case CC_SIZE                : return { ...state, cc_size: value }
    case CC_FONT                : return { ...state, cc_font: value }
    case CC_POSITION            : return { ...state, cc_position: value }

    // Default
    default                     : return state
  }
}

export default watchReducer