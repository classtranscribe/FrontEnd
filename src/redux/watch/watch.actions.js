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
import { createAction } from '../redux-creators'


// Metadata
export const setMedia             = createAction(SET_MEDIA)
export const setPlaylist          = createAction(SET_PLAYLIST)
export const setPlaylists         = createAction(SET_PLAYLISTS)
export const setOffering          = createAction(SET_OFFERING)
export const setWatchHistory      = createAction(SET_WATCH_HISTORY)
export const setStarredOfferings  = createAction(SET_STARRED_OFFERINGS)

// Transcription
export const setTranscriptions    = createAction(SET_TRANSCPTIONS)
export const setCurrTrans         = createAction(SET_CURR_TRANS)
export const setTranscript        = createAction(SET_TRANSCRIPT)
export const setCaptions          = createAction(SET_CAPTIONS)
export const setCurrCaption       = createAction(SET_CURR_CAPTION)
export const setDescriptions      = createAction(SET_DESCRIPTION)
export const setCurrDescription   = createAction(SET_CURR_DESCRIPTION)
export const setCurrEditing       = createAction(SET_CURR_EDITING)
export const setBulkEditing       = createAction(SET_BULK_EDITING)
export const setOpenCC            = createAction(SET_OPENCC)
export const setOpenAD            = createAction(SET_OPENAD)

// Settings
export const setMode              = createAction(SET_MODE)
export const setTransView         = createAction(SET_TRANS_VIEW)
export const setMenu              = createAction(SET_MENU)
export const setModal             = createAction(SET_MODAL)

// Player actions
export const setPlaybackrate      = createAction(SET_PLAYBACKRATE)
export const setTime              = createAction(SET_TIME)
export const setBufferedTime      = createAction(SET_BUFFERED_TIME)
export const setDuration          = createAction(SET_DURATION)
export const setVolume            = createAction(SET_VOLUME)
export const setMute              = createAction(SET_MUTE)
export const setPause             = createAction(SET_PAUSE)
export const switchScreen         = createAction(SWITCH_SCREEN)
export const setFullscreen        = createAction(SET_FULLSCREEN)
export const setCTPPriEvent       = createAction(SET_CTP_PRI_E)
export const setCTPSecEvent       = createAction(SET_CTP_SEC_E)

// CC Options
export const cc_setColor          = createAction(CC_COLOR)
export const cc_setBG             = createAction(CC_BG)
export const cc_setOpacity        = createAction(CC_OPACITY)
export const cc_setSize           = createAction(CC_SIZE)
export const cc_setPosition       = createAction(CC_POSITION)
export const cc_setFont           = createAction(CC_FONT)

// Others
export const setSearch            = createAction(SET_SEARCH)
export const setPrompt            = createAction(SET_PROMPT)

// actions
export const setReduxState        = createAction(SET_STATE)

export const changeVideo          = createAction(CHANGE_VIDEO)

export const resetStates          = createAction(RESET_STATES)

export const timeUpdate           = value => ({ 
                                        type: TIME_UPDATE, 
                                        value: { 
                                            time: value[0], 
                                            currCaption: value[1] 
                                        } 
                                    }) 