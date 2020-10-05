import { createAction } from '../../redux-creators';
import {
  SET_TRANSCRIPTIONS,
  SET_VIDEO_TIME,
  SET_LANGUAGE,
  // SET_EDITING
} from './trans.action.types';

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);
export const setVideoTime = createAction(SET_VIDEO_TIME);
export const setLanguage = createAction(SET_LANGUAGE);
// export const setEditing = createAction(SET_EDITING);