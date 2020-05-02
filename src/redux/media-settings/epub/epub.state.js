import { ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils/constants.util';
import { 
    DEFAULT_IS_MANAGING_CHAPTERS, 
    EDITOR_DISPLAY 
} from 'screens/MediaSettings/Utils/epub/constants';

export const initialState = {
    language: ENGLISH,
    isManagingChapters: DEFAULT_IS_MANAGING_CHAPTERS,

    epubData: ARRAY_INIT,
    chapters: ARRAY_INIT,
    currChapter: {},

    coverImgs: [],
    magnifiedImg: null,
    foldedIds: [],

    navId: '',
    showNav: false,

    txtEditor: EDITOR_DISPLAY,

    error: null
};