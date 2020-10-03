import PConstants from './constants/PlayerConstants';
// import LConstants from './constants/LanguageConstants';
import CaptionStyle from './structs/CaptionStyle';
import Language from './structs/Language';

const initialState = {
  // -----------------------------------------------------------------
  // Media Data
  // -----------------------------------------------------------------
  error: null,
  media: null,
  src1: null,
  src2: null,
  // captions data
  transcriptions: [],
  currTranscription: null,
  language: new Language().getData(),
  captions: [],
  currCaption: null,

  // -----------------------------------------------------------------
  // Player Attributes
  // -----------------------------------------------------------------
  videoReady: false,
  userReady: false,
  userActive: false,
  size: 'xs',
  event: null,
  screenMode: PConstants.ScreenModeNormal,
  isSwappedScreen: false,
  isFullscreen: false,
  openCC: false,
  ccStyle: new CaptionStyle().getData(),

  // -----------------------------------------------------------------
  // Video Attributes
  // -----------------------------------------------------------------
  duration: 0,
  time: 0,
  bufferedTime: 0,
  muted: false,
  volume: 1,
  playbackRate: 1,
  isPaused: true,
  isEnded: false,  

  // -----------------------------------------------------------------
  // Range
  // -----------------------------------------------------------------
  openRange: false,
  range: null,
};

export default initialState;