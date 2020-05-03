import { ARRAY_INIT } from 'utils';
import { ENGLISH } from 'screens/Watch/Utils/constants.util';
import { mspPreference as pref  } from 'utils/user-preference/media-settings';
import { 
    DEFAULT_IS_MANAGING_CHAPTERS, 
    EDITOR_DISPLAY,
    NAV_CLOSE,
    EDITOR_THEME_XCODE,
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
    showNav: NAV_CLOSE,

    txtEditor: EDITOR_DISPLAY,
    editorTheme: pref.defaultEditorTheme() || EDITOR_THEME_XCODE,
    editorFullscreen: false,

    error: null
};