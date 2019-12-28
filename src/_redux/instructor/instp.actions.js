import {
  // Course page
  SET_OFFERINGS,
  // Offering page
  SET_OFFERING,
  SET_PLAYLISTS,
  SET_PLAYLIST,
} from './instp.action.types'

// Course page
export const setOfferings     = value => ({ type: SET_OFFERINGS, value })

// Offering page
export const setOffering      = value => ({ type: SET_OFFERING, value })
export const setPlaylists     = value => ({ type: SET_PLAYLISTS, value })
export const setPlaylist      = value => ({ type: SET_PLAYLIST, value })