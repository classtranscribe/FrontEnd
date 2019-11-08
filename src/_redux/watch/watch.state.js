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
  transcriptions: [],
  currTrans: {},
  captions: [],

  // screen options
  menu: "menu-hide",
  mode: "normal-mode",

  // Video player options
  paused: true,
  volume: 1,
  muted: false,
  playbackrate: 1.0,
  isSwitched: false,
  time: 0,
  duration: 0,
  bufferedTime: 0,
  isFullscreen: false,
  openCC: false,

  // CC options
  cc_color: 'white',
  cc_bg: 'black',
  cc_size: 1,
  cc_font: "sans-serif",
  cc_position: 'bottom',
  cc_opacity: 1,
}