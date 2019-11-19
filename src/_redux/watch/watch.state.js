import { preferControl } from "../../screens/Watch/Utils"

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
  menu: "menu-hide",
  mode: "normal-mode",
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
  cc_color: 'white',
  cc_bg: 'black',
  cc_size: 1,
  cc_font: "sans-serif",
  cc_position: 'bottom',
  cc_opacity: .8,

  // Others
  currEditing: null,
  prompt: null,
  search: null,
}