import { ARRAY_INIT } from 'utils/constants';
import { CTPlayerConstants as PConstants } from '../../CTPlayer';
import Constants from '../controllers/EPubConstants';

export const initialState = {
  error: null,
  step: Constants.EPUB_STEP_SPLIT,
  language: PConstants.ENGLISH,
  rawEPubData: ARRAY_INIT,
  epubs: [],
  currEPubIndex: 0,
  chapters: [],
  currChIndex: 0,
  navId: null,
  showNav: false,
  magnifiedImg: null,
  foldedIds: [],
};