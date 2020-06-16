import Constants from './player-constants';

const initialState = {
  // media
  media: null,
  src1: null,
  src2: null,
  videoReady: false,
  userReady: false,
  size: 'xs',
  event: null,
  screenMode: Constants.SCREEN_NORMAL,
  isSwappedScreen: false,

  // video
  duration: 0,
  time: 0,
  bufferedTime: 0,
  muted: false,
  volume: 1,
  playbackRate: 1,
  isPaused: true,
  isEnded: false,
  isFullscreen: false,

  // captions
  openCC: false,
  transcriptions: [],
  currTranscription: null,
  language: {
    code: Constants.ENGLISH, 
    text: Constants.LANG_MAP[Constants.ENGLISH]
  },
  captions: [],
  currCaption: null,

  // cc styles
  ccFontSize: Constants.CC_FSIZCTPE_100,
  ccFontColor: Constants.CC_COLOR_WHITE,
  ccOpacity: Constants.CC_OPACITY_75,
  ccBackgroundColor: Constants.CC_COLOR_BLACK,

  // range
  openRange: false,
  range: null,
};

export default initialState;