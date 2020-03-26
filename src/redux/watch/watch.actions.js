import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_PLAYLISTS,
  SET_OFFERING,
  SET_WATCH_HISTORY,
  SET_STARRED_OFFERINGS,
  // Trans
  SET_TRANSCPTIONS,
  SET_CURR_TRANS,
  SET_CAPTIONS,
  SET_TRANSCRIPT,
  SET_CURR_CAPTION,
  SET_DESCRIPTION,
  SET_CURR_DESCRIPTION,
  SET_CURR_EDITING,
  SET_BULK_EDITING,
  SET_OPENCC,
  SET_OPENAD,
  // Screen Options
  SET_MODE,
  SET_TRANS_VIEW,
  SET_MENU,
  SET_MODAL,
  // Player Options
  SET_PAUSE,
  SET_TIME,
  SET_DURATION,
  SET_BUFFERED_TIME,
  SET_VOLUME,
  SET_MUTE,
  SET_PLAYBACKRATE,
  SWITCH_SCREEN,
  SET_FULLSCREEN,
  SET_CTP_PRI_E,
  SET_CTP_SEC_E,
  // CC Options
  CC_COLOR,
  CC_BG,
  CC_OPACITY,
  CC_SIZE,
  CC_POSITION,
  CC_FONT,
  // Others
  SET_SEARCH,
  SET_PROMPT,
  // actions
  SET_STATE,
  CHANGE_VIDEO,
  TIME_UPDATE,
  RESET_STATES,
} from './watch.action.types'


// Metadata
export const setMedia             = value => ({ type: SET_MEDIA, value })
export const setPlaylist          = value => ({ type: SET_PLAYLIST, value })
export const setPlaylists         = value => ({ type: SET_PLAYLISTS, value })
export const setOffering          = value => ({ type: SET_OFFERING, value })
export const setWatchHistory      = value => ({ type: SET_WATCH_HISTORY, value })
export const setStarredOfferings  = value => ({ type: SET_STARRED_OFFERINGS, value })

// Transcription
export const setTranscriptions    = value => ({ type: SET_TRANSCPTIONS, value })
export const setCurrTrans         = value => ({ type: SET_CURR_TRANS, value })
export const setTranscript        = value => ({ type: SET_TRANSCRIPT, value })
export const setCaptions          = value => ({ type: SET_CAPTIONS, value })
export const setCurrCaption       = value => ({ type: SET_CURR_CAPTION, value })
export const setDescriptions      = value => ({ type: SET_DESCRIPTION, value })
export const setCurrDescription   = value => ({ type: SET_CURR_DESCRIPTION, value })
export const setCurrEditing       = value => ({ type: SET_CURR_EDITING, value })
export const setBulkEditing       = value => ({ type: SET_BULK_EDITING, value })
export const setOpenCC            = value => ({ type: SET_OPENCC, value })
export const setOpenAD            = value => ({ type: SET_OPENAD, value })

// Settings
export const setMode              = value => ({ type: SET_MODE, value })
export const setTransView         = value => ({ type: SET_TRANS_VIEW, value })
export const setMenu              = value => ({ type: SET_MENU, value })
export const setModal             = value => ({ type: SET_MODAL, value })

// Player actions
export const setPlaybackrate      = value => ({ type: SET_PLAYBACKRATE, value })
export const setTime              = value => ({ type: SET_TIME, value })
export const setBufferedTime      = value => ({ type: SET_BUFFERED_TIME, value })
export const setDuration          = value => ({ type: SET_DURATION, value })
export const setVolume            = value => ({ type: SET_VOLUME, value })
export const setMute              = value => ({ type: SET_MUTE, value })
export const setPause             = value => ({ type: SET_PAUSE, value })
export const switchScreen         = value => ({ type: SWITCH_SCREEN, value })
export const setFullscreen        = value => ({ type: SET_FULLSCREEN, value })
export const setCTPPriEvent       = value => ({ type: SET_CTP_PRI_E, value })
export const setCTPSecEvent       = value => ({ type: SET_CTP_SEC_E, value })

// CC Options
export const cc_setColor          = value => ({ type: CC_COLOR, value })
export const cc_setBG             = value => ({ type: CC_BG, value })
export const cc_setOpacity        = value => ({ type: CC_OPACITY, value })
export const cc_setSize           = value => ({ type: CC_SIZE, value })
export const cc_setPosition       = value => ({ type: CC_POSITION, value })
export const cc_setFont           = value => ({ type: CC_FONT, value })

// Others
export const setSearch            = value => ({ type: SET_SEARCH, value })
export const setPrompt            = value => ({ type: SET_PROMPT, value })

// actions
export const setReduxState        = value => ({ type: SET_STATE, value })
export const timeUpdate           = value => ({ type: TIME_UPDATE, value: { time: value[0], currCaption: value[1] } }) 
export const changeVideo          = value => ({ type: CHANGE_VIDEO, value })

export const resetStates          = value => ({ type: RESET_STATES, value })