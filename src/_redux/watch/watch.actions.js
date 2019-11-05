import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_PLAYLISTS,
  SET_WATCH_HISTORY,
  SET_STARRED_OFFERINGS,

  SET_MENU,
  SET_MODE,
  
  SET_PLAYBACKRATE
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