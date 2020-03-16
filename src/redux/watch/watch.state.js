import { isMobile } from "react-device-detect"
import {
  DEFAULT_ROLE,
} from "../../utils/constants"

import { 
  preferControl, 
  // constants
  MENU_HIDE,
  NORMAL_MODE,
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_SIZE_100,
  CC_SIZE_75,
  CC_FONT_SANS_SERIF,
  CC_OPACITY_75,
  CC_POSITION_BOTTOM,
  SEARCH_INIT,
  CTP_LOADING,
  MODAL_HIDE,
  // MODAL_SHARE
} from "../../screens/Watch/Utils"

export const initialState = {
  // Basics
  userRole: DEFAULT_ROLE,
  
  // Metadata
  media: { 
    id: "", 
    mediaName: "", 
    createdAt: "", 
    isTwoScreen: false, 
    videos: [], 
    transcriptions: [],
    isUnavailable: false
  },
  playlist: {},
  playlists: [],
  watchHistory: [],
  starredOfferings: [],

  // Trans
  transcriptions: [],
  currTrans: {},
  transcript: [],
  captions: [],
  currCaption: null,
  descriptions: [],
  currDescription: null,
  currEditing: null,
  bulkEditing: false,
  openCC: preferControl.cc(),
  openAD: preferControl.ad(),

  // screen options
  mode: NORMAL_MODE,
  transView: preferControl.defaultTransView(),
  menu: MENU_HIDE,
  modal: MODAL_HIDE,

  // Video player options
  paused: true,
  volume: 1,
  muted: false,
  playbackrate: preferControl.defaultPlaybackRate(),
  isSwitched: false,
  time: 0,
  duration: 0,
  bufferedTime: 0,
  isFullscreen: false,
  ctpPriEvent: CTP_LOADING,
  ctpSecEvent: CTP_LOADING,

  // CC options
  cc_color: CC_COLOR_WHITE,
  cc_bg: CC_COLOR_BLACK,
  cc_size: isMobile ? CC_SIZE_75 : CC_SIZE_100,
  cc_font: CC_FONT_SANS_SERIF,
  cc_position: CC_POSITION_BOTTOM,
  cc_opacity: CC_OPACITY_75,

  // Others
  prompt: null,
  search: SEARCH_INIT,
}