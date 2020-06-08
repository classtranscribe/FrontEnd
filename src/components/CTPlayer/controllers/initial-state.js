import { ENGLISH, langMap } from 'screens/Watch/Utils/constants.util';

export const initialState = {
  // media
  media: null,
  src1: null,
  src2: null,
  // captions
  openCC: false,
  transcriptions: [],
  currTranscription: null,
  language: {code: ENGLISH, text: langMap[ENGLISH]},
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
};