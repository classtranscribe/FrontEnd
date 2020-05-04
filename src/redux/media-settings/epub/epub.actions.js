import {
    SET_LANGUAGE, 
    SET_STEP,
    SET_IS_MANAGING_CHAPTERS,
    SET_EPUB_DATA,
    SET_CHAPTERS,
    SET_CURR_CHAPTER,
    SET_COVER_IMGS,
    SET_MAGNIFIED_IMG,
    SET_FOLDED_IDS,
    SET_NAV_ID,
    SET_SHOW_NAV,
    SET_TXT_EDITOR,
    SET_EDITOR_THEME,
    SET_EDITOR_FULLSCREEN,
    SET_ERROR
} from './epub.action.types';
import { createAction } from '../../redux-creators';


export const setLanguage            = createAction(SET_LANGUAGE);
export const setStep                = createAction(SET_STEP);
export const setIsManagingChapters  = createAction(SET_IS_MANAGING_CHAPTERS);

export const setEpubData            = createAction(SET_EPUB_DATA);
export const setChapters            = createAction(SET_CHAPTERS);
export const setCurrChapter         = createAction(SET_CURR_CHAPTER);

export const setCoverImgs           = createAction(SET_COVER_IMGS);
export const setMagnifiedImg        = createAction(SET_MAGNIFIED_IMG);
export const setFoldedIds           = createAction(SET_FOLDED_IDS);

export const setNavId               = createAction(SET_NAV_ID);
export const setShowNav             = createAction(SET_SHOW_NAV);

export const setTxtEditor           = createAction(SET_TXT_EDITOR);
export const setEditorTheme         = createAction(SET_EDITOR_THEME);
export const setEditorFullscreen    = createAction(SET_EDITOR_FULLSCREEN);

export const setError               = createAction(SET_ERROR);