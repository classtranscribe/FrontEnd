import { ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils/constants.util';
import {
    EPUB_DEFAULT_STEP,
    NAV_CLOSE,
} from 'screens/MediaSettings/Utils/epub/constants';

export const initialState = {
    language: ENGLISH,
    step: EPUB_DEFAULT_STEP,

    epubData: ARRAY_INIT,
    chapters: ARRAY_INIT,
    currChapter: {},

    magnifiedImg: null,
    foldedIds: [],

    navId: '',
    showNav: NAV_CLOSE,

    error: null
};