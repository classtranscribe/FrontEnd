import PConstants from './constants/PlayerConstants';
import LConstants from './constants/LanguageConstants';
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
  size: 'xs',
  event: null,
  screenMode: PConstants.ScreenModeNormal,
  isSwappedScreen: false,
  isFullscreen: false,
  openCC: false,

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
  // CC Styles
  // -----------------------------------------------------------------
  ccStyle: new CaptionStyle().getData(),
  ccFontSize: LConstants.CCFontSize100,
  ccFontColor: LConstants.CCColorWhite,
  ccOpacity: LConstants.CCOpacity75,
  ccBackgroundColor: LConstants.CCColorBlack,

  // -----------------------------------------------------------------
  // Range
  // -----------------------------------------------------------------
  openRange: false,
  range: null,
};

export default initialState;