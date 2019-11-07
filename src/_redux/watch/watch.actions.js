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
  SET_DURATION,
  SET_BUFFERED_TIME,
  SET_VOLUME,
  SET_MUTE,
  SET_PLAYBACKRATE,
  SET_TRANS,
  SWITCH_SCREEN,
  SET_FULLSCREEN,
} from './watch.action.types'


// Metadata
export const setMedia = value => ({ type: SET_MEDIA, value })
export const setPlaylist = value => ({ type: SET_PLAYLIST, value })
export const setPlaylists = value => ({ type: SET_PLAYLISTS, value })
export const setWatchHistory = value => ({ type: SET_WATCH_HISTORY, value })
export const setStarredOfferings = value => ({ type: SET_STARRED_OFFERINGS, value })

// Settings
export const setMenu = value => ({ type: SET_MENU, value })
export const setMode = value => ({ type: SET_MODE, value })

// Player actions
export const setPlaybackrate = value => ({ type: SET_PLAYBACKRATE, value })
export const setTime = value => ({ type: SET_TIME, value })
export const setBufferedTime = value => ({ type: SET_BUFFERED_TIME, value })
export const setDuration = value => ({ type: SET_DURATION, value })
export const setVolume = value => ({ type: SET_VOLUME, value })
export const setMute = value => ({ type: SET_MUTE, value })
export const setPause = value => ({ type: SET_PAUSE, value })
export const setTrans = value => ({ type: SET_TRANS, value })
export const switchScreen = value => ({ type: SWITCH_SCREEN, value })
export const setFullscreen = value => ({ type: SET_FULLSCREEN, value })