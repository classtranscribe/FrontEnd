import Constants from './player-constants';

export default {
  // media
  media: null,
  src1: null,
  src2: null,
  videoReady: false,
  userReady: false,
  size: 'xs',
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
  // video
  duration: 0,
  time: 0,
  bufferedTime: 0,
  muted: false,
  volume: 1,
  playbackRate: 1,
  isPaused: true,
  isEnded: false,
  isSwitchedScreen: false,
  isFullscreen: false,
  event: null,
  // range
  openRange: false,
  range: null,
};