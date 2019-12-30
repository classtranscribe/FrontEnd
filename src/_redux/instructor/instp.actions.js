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

// Course page
export const setOfferings     = value => ({ type: SET_OFFERINGS, value })
export const setDeparts       = value => ({ type: SET_DEPARTS, value })
export const setTerms         = value => ({ type: SET_TERMS, value })

// Offering page
export const setOffering      = value => ({ type: SET_OFFERING, value })
export const setPlaylists     = value => ({ type: SET_PLAYLISTS, value })
export const setPlaylist      = value => ({ type: SET_PLAYLIST, value })

// others
export const setSidebar       = value => ({ type: SET_SIDEBAR, value })