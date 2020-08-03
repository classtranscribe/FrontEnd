import { ARRAY_INIT } from 'utils/constants';
import { CTPlayerConstants as PConstants } from '../../CTPlayer';
import Constants from '../controllers/EPubConstants';

export const initialState = {
  error: null,
  step: Constants.EPubStepDefaultFirstStep,
  language: PConstants.English,
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