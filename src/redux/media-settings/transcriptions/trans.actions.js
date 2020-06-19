import { createAction } from '../../redux-creators';
import {
  SET_TRANSCRIPTIONS
} from './trans.action.types';

export const setTranscriptions = createAction(SET_TRANSCRIPTIONS);