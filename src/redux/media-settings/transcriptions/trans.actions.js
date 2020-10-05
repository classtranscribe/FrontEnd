import { createAction } from '../../redux-creators';
import {
  SET_TRANSCRIPTIONS,
  SET_VIDEO_TIME,
  SET_LANGUAGE,
} from './trans.action.types';

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);
export const setVideoTime = createAction(SET_VIDEO_TIME);
export const setLanguage = createAction(SET_LANGUAGE);