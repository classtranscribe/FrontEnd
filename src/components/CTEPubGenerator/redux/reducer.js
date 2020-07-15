import { initialState } from './state';
import {
  SET_ERROR,
  SET_STEP,
  SET_LANGUAGE,
  SET_RAW_EPUB_DATA,
  SET_EPUBS,
  SET_CURR_EPUB_IDX,
  SET_CHAPTERS,
  SET_CURR_CH_IDX,
  SET_NAV_ID,
  SET_SHOW_NAV,
  SET_MAGNIFIED_IMG,
  SET_FOLDED_IDS,
  RESET_STATES
} from './action.types';

const epubReducer = (state = initialState, action) => {
  const { type, value } = action;

  switch (type) {
    case SET_ERROR:
      return { ...state, error: value };
    case SET_STEP:
      return { ...state, step: value };
    case SET_LANGUAGE:
      return { ...state, language: value };

    case SET_RAW_EPUB_DATA:
      return { ...state, rawEPubData: value };
    case SET_EPUBS:
      return { ...state, epubs: value, currEPubIndex: 0 };
    case SET_CURR_EPUB_IDX:
      return { 
        ...state,
        currEPubIndex: value,
        // reset the rest chapter-related states
        chapters: initialState.chapters,
        currChIndex: initialState.currChIndex,
        navId: initialState.navId,
        showNav: initialState.showNav,
        magnifiedImg: initialState.magnifiedImg,
        foldedIds: initialState.foldedIds
      };
    case SET_CHAPTERS:
      return { ...state, chapters: value };
    case SET_CURR_CH_IDX:
      return { ...state, currChIndex: value };

    case SET_NAV_ID:
      return { ...state, navId: value };
    case SET_SHOW_NAV:
      return { ...state, showNav: value };

    case SET_MAGNIFIED_IMG:
      return { ...state, magnifiedImg: value };
    case SET_FOLDED_IDS:
      return { ...state, foldedIds: value };

    case RESET_STATES:
      return initialState;

    default:
      return state;
  }
};

export default epubReducer;
