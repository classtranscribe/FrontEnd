import { ARRAY_INIT } from 'utils/constants';
import { LanguageConstants } from 'components/CTPlayer';
import Constants from './EPubConstants';

export const initialState = {
  error: null,
  step: Constants.EPubStepDefaultFirstStep,
  language: LanguageConstants.English,
  rawEPubData: ARRAY_INIT,
  epubs: ARRAY_INIT,
  currEPub: null,
  chapters: ARRAY_INIT,
  currChIndex: 0,
  navId: null,
  showNav: false,
  magnifiedImg: null,
  foldedIds: [],
  ePubItemId: null,
  playerData: null
};