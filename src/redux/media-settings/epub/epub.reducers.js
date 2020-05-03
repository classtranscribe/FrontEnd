import {
    SET_LANGUAGE, 
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
    SET_ERROR,
} from './epub.action.types';
import { initialState } from './epub.state';

const epubReducer = (
    state=initialState,
    action
) => {

    const { type, value } = action;

    switch (type) {
        case SET_LANGUAGE                 : return { ...state, language: value };
        case SET_IS_MANAGING_CHAPTERS     : return { ...state, isManagingChapters: value };

        case SET_EPUB_DATA                : return { ...state, epubData: value };
        case SET_CHAPTERS                 : return { ...state, chapters: value };
        case SET_CURR_CHAPTER             : return { ...state, currChapter: value };

        case SET_COVER_IMGS               : return { ...state, coverImgs: value };
        case SET_MAGNIFIED_IMG            : return { ...state, magnifiedImg: value };
        case SET_FOLDED_IDS               : return { ...state, foldedIds: value };

        case SET_NAV_ID                   : return { ...state, navId: value };
        case SET_SHOW_NAV                 : return { ...state, showNav: value };

        case SET_TXT_EDITOR               : return { ...state, txtEditor: value };
        case SET_EDITOR_THEME             : return { ...state, editorTheme: value };
        case SET_EDITOR_FULLSCREEN        : return { ...state, editorFullscreen: value };

        case SET_ERROR                    : return { ...state, error: value };

        default                           : return state;
    }
}

export default epubReducer;