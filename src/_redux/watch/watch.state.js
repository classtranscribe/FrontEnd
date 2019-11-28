import { 
  preferControl, 
  MENU_HIDE,
  NORMAL_MODE,
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_SIZE_100,
  CC_FONT_SANS_SERIF,
  CC_OPACITY_75,
  CC_POSITION_BOTTOM,
  SEARCH_INIT
} from "../../screens/Watch/Utils"

export const initialState = {
  // Basic metadata
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
  openCC: preferControl.cc(),
  openAD: preferControl.ad(),

  // screen options
  menu: MENU_HIDE,
  mode: NORMAL_MODE,
  transView: preferControl.defaultTransView(),

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

  // CC options
  cc_color: CC_COLOR_WHITE,
  cc_bg: CC_COLOR_BLACK,
  cc_size: CC_SIZE_100,
  cc_font: CC_FONT_SANS_SERIF,
  cc_position: CC_POSITION_BOTTOM,
  cc_opacity: CC_OPACITY_75,

  // Others
  currEditing: null,
  prompt: null,
  search: SEARCH_INIT,
}