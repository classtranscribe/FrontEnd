import Constants from './PlayerConstants';

const initialState = {
  // media
  error: null,
  media: null,
  src1: null,
  src2: null,
  videoReady: false,
  userReady: false,
  size: 'xs',
  event: null,
  screenMode: Constants.ScreenModeNormal,
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
    code: Constants.English, 
    text: Constants.decode(Constants.English)
  },
  captions: [],
  currCaption: null,

  // cc styles
  ccFontSize: Constants.CCFontSize100,
  ccFontColor: Constants.CCColorWhite,
  ccOpacity: Constants.CCOpacity75,
  ccBackgroundColor: Constants.CCColorBlack,

  // range
  openRange: false,
  range: null,
};

export default initialState;