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
  SET_IS_VIEWING_ANALYTICS,
  // Playlist
  SET_PLAYLIST,
  SET_IS_SELECTING_VIDEOS,
  SET_SELECTED_VIDEOS,
  // Others
  SET_LOADING,
  SET_CONFIRMATION,
  SET_PROMPT,
} from './instp.action.types'

// Sidebar
export const setSidebar             = value => ({ type: SET_SIDEBAR, value })
export const setOfferings           = value => ({ type: SET_OFFERINGS, value })
export const setDeparts             = value => ({ type: SET_DEPARTS, value })
export const setTerms               = value => ({ type: SET_TERMS, value })

// Course
export const setOffering            = value => ({ type: SET_OFFERING, value })
export const setPlaylists           = value => ({ type: SET_PLAYLISTS, value })
export const setIsEditingOffering   = value => ({ type: SET_IS_EDITING_OFFERING, value })
export const setIsViewingAnalytics  = value => ({ type: SET_IS_VIEWING_ANALYTICS, value })

// Playlist
export const setPlaylist            = value => ({ type: SET_PLAYLIST, value })
export const setIsSelectingVideos   = value => ({ type: SET_IS_SELECTING_VIDEOS, value })
export const setSelectedVideos      = value => ({ type: SET_SELECTED_VIDEOS, value })

// Others
export const setLoading             = value => ({ type: SET_LOADING, value })
export const setConfirmation        = value => ({ type: SET_CONFIRMATION, value })
export const setPrompt              = value => ({ type: SET_PROMPT, value })
