import { ARRAY_INIT } from 'utils/constants';
import Constants from './EPubConstants';

export const initialState = {
  error: null,
  step: Constants.EPubStepDefaultFirstStep,
  epub: null,
  chapters: ARRAY_INIT,
  currChIndex: 0,
  saved: true,
  navId: null,
  showNav: false,
  playerData: null
};