/**
 * constants
 */

/**
 * General
 */
// Clear Options
export const CO_CHANGE_VIDEO = 'co-change-video';
// Errors
export const ERR_AUTH = {
  code: 401,
  header: 'Unauthorized Access',
  description: 'Sorry, you are not authorized for your requested page or resource.',
};
export const ERR_INVALID_MEDIA_ID = {
  code: 404,
  header: 'The media cannot be found',
  description: "Sorry, your requested URL doesn't contain a valid media ID.",
};

/**
 * Arrays
 */
export const ARRAY_INIT = ['init'];
export const ARRAY_EMPTY = ['empty'];
export const ARRAY_RETRY = ['retry'];

/**
 * Screen Modes
 */
export const NORMAL_MODE = 'normal-mode';
export const THEATRE_MODE = 'theatre-mode';
export const PS_MODE = 'ps-mode';
export const EQUAL_MODE = 'equal-mode';
export const NESTED_MODE = 'nested-mode';
export const BULK_EDIT_MODE = 'bulk-edit-mode';
export const screenModes = [
  { type: NORMAL_MODE, name: 'Primary View', icon: 'video_label' },
  { type: PS_MODE, name: 'Distributed View', icon: 'view_carousel' },
  { type: NESTED_MODE, name: 'Nested View', icon: 'picture_in_picture' },
  // { type: THEATRE_MODE, name: 'Theatre View', icon: 'movie' },
];

/**
 * Player types
 */
export const PRIMARY = 'ct-player-primary';
export const SECONDARY = 'ct-player-secondary';

/**
 * Player Events
 */
export const CTP_PLAYING = 'ctp-playing';
export const CTP_LOADING = 'ctp-loading';
export const CTP_UP_NEXT = 'ctp-up-next'; // last minute ?
export const CTP_ENDED = 'ctp-ended';
export const CTP_ERROR = 'ctp-error';

/**
 * Menu types
 */
export const MENU_HIDE = 'menu-hide';
export const MENU_BEFORE_HIDE = 'menu-before-hide';
export const MENU_PLAYLISTS = 'menu-playlists';
export const MENU_PLAYBACKRATE = 'menu-playbackrate';
export const MENU_SETTING = 'menu-setting';
export const MENU_LANGUAGE = 'menu-language';
export const MENU_SCREEN_MODE = 'menu-screen-mode';
export const MENU_DOWNLOAD = 'menu-download';
export const MENU_SHORTCUTS = 'menu-shortcuts';
// Setting menu tabs
export const SMTAB_GENERAL = 'tab-general';
export const SMTAB_TRANS = 'tab-trans';
export const SMTAB_CC = 'tab-cc';
export const SMTAB_AD = 'tab-ad';

/**
 * Modals
 */
export const MODAL_HIDE = 'modal-hide';
export const MODAL_BEFORE_HIDE = 'modal-before-hide';
export const MODAL_SHARE = 'modal-share';

/**
 * Caption Languages
 */
export const ENGLISH = 'en-US';
export const SIMPLIFIED_CHINESE = 'zh-Hans';
export const KOREAN = 'ko';
export const SPANISH = 'es';
export const FRENCH = 'fr';
export const langOptions = [ENGLISH, SIMPLIFIED_CHINESE, KOREAN, SPANISH, FRENCH];
export const langMap = {
  'en-US': 'English',
  'zh-Hans': 'Simplified Chinese',
  ko: 'Korean',
  es: 'Spanish',
  fr: 'French',
};

/**
 * WebVTT kinds
 */
export const WEBVTT_SUBTITLES = 'subtitles';
export const WEBVTT_DESCRIPTIONS = 'descriptions';
export const WEBVTT_CHAPTERS = 'chapters';

/**
 * Transcription View
 */
export const LINE_VIEW = 'Caption Line View';
export const TRANSCRIPT_VIEW = 'Transcript View';
export const HIDE_TRANS = 'Hide Transcription';

/**
 * Search
 */
// Caption Search Options
export const SEARCH_TRANS_IN_COURSE = 'search-trans-in-course';
export const SEARCH_TRANS_IN_VIDEO = 'search-trans-in-video';
export const SEARCH_IN_PLAYLISTS = 'search-video-in-playlists';
export const SEARCH_IN_SHORTCUTS = 'search-in-shortcuts';
// Search Status
export const SEARCH_HIDE = 'search-hide';
export const SEARCH_BEGIN = 'search-begin';
export const SEARCH_SEARCHING = 'search-searching';
export const SEARCH_RESULT = 'search-result';
// Others
export const SEARCH_PAGE_NUM = 20;
export const SEARCH_INIT = {
  status: SEARCH_HIDE,
  option: SEARCH_TRANS_IN_VIDEO,
  value: '',
  inVideoTransResults: ARRAY_INIT,
  inCourseTransResults: ARRAY_INIT,
  playlistResults: ARRAY_INIT,
  shortcutResults: ARRAY_INIT,
};

/**
 * CT Player static options
 */
export const playbackRateOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2 /* , 3, 4 */];

/**
 * CC Setting
 */
// Color
export const CC_COLOR_WHITE = 'white';
export const CC_COLOR_BLACK = 'black';
export const CC_COLOR_GREEN = 'green';
export const CC_COLOR_BLUE = 'blue';
export const CC_COLOR_CYAN = 'cyan';
export const CC_COLOR_RED = 'red';
export const CC_COLOR_MAGENTA = 'magenta';
export const CC_COLOR_YELLOW = 'yellow';
export const cc_colorOptions = [
  CC_COLOR_WHITE,
  CC_COLOR_CYAN,
  CC_COLOR_BLUE,
  CC_COLOR_GREEN,
  CC_COLOR_RED,
  CC_COLOR_MAGENTA,
  CC_COLOR_YELLOW,
  CC_COLOR_BLACK,
];
// font family
export const CC_FONT_SERIF = 'serif';
export const CC_FONT_SANS_SERIF = 'sans-serif';
export const CC_FONT_MONOSPACE = 'monospace';
export const CC_FONT_CURSIVE = 'cursive';
export const CC_FONT_FANTASY = 'fantasy';
export const cc_fontOptions = [
  CC_FONT_SERIF,
  CC_FONT_SANS_SERIF,
  CC_FONT_MONOSPACE,
  CC_FONT_CURSIVE,
  CC_FONT_FANTASY,
];
export const cc_colorMap = {
  [CC_COLOR_RED]: 'rgba(255,0,0,*)',
  [CC_COLOR_GREEN]: 'rgba(0,128,0,*)',
  [CC_COLOR_WHITE]: 'rgba(255,255,255,*)',
  [CC_COLOR_BLACK]: 'rgba(0,0,0,*)',
  [CC_COLOR_BLUE]: 'rgba(0,0,255,*)',
  [CC_COLOR_CYAN]: 'rgba(0,255,255,*)',
  [CC_COLOR_YELLOW]: 'rgba(255,255,0,*)',
  [CC_COLOR_MAGENTA]: 'rgba(255,0,255,*)',
};
// font size
export const CC_SIZE_75 = 0.75;
export const CC_SIZE_100 = 1;
export const CC_SIZE_125 = 1.25;
export const CC_SIZE_175 = 1.75;
export const CC_SIZE_200 = 2;
export const cc_sizeOptions = [CC_SIZE_75, CC_SIZE_100, CC_SIZE_125, CC_SIZE_175, CC_SIZE_200];
// opacity
export const CC_OPACITY_0 = 0;
export const CC_OPACITY_25 = 0.25;
export const CC_OPACITY_50 = 0.5;
export const CC_OPACITY_75 = 0.75;
export const CC_OPACITY_100 = 1;
export const cc_opacityOptions = [
  CC_OPACITY_0,
  CC_OPACITY_25,
  CC_OPACITY_50,
  CC_OPACITY_75,
  CC_OPACITY_100,
];
// position
export const CC_POSITION_TOP = 'top';
export const CC_POSITION_BOTTOM = 'bottom';
export const CC_POSITION_UNDER = 'under video';
export const cc_positionOptions = [CC_POSITION_TOP, CC_POSITION_BOTTOM, CC_POSITION_UNDER];

/**
 * User actions for watch page
 */
export const UA_TIME_UPDATE = 'timeupdate';
export const UA_PLAY = 'play';
export const UA_PAUSE = 'pause';
export const UA_SEEKING = 'seeking';
export const UA_SEEKED = 'seeked';
export const UA_CHANGE_SPEED = 'changedspeed';
export const UA_FULLSCREEN_CHANGE = 'fullscreenchange';
export const UA_SCREEN_MODE_CHANGE = 'screenmodechange';
export const UA_USER_INACTIVE = 'userinactive';

export const UA_LANG_CHANGE = 'langchange';
export const UA_FILTER_TRANS = 'filtertrans';
export const UA_EDIT_TRANS = 'edittrans';
export const UA_TRANS_VIEW_CHANGE = 'transviewchange';
export const UA_TRANS_AUTO_SCROLL_CHANGE = 'autoScrollChange';
export const UA_TRANS_PAUSE_WHEN_EDIT = 'pauseWhenEdit';
export const UA_TRANS_PAUSE_WHEN_AD_STARTS = 'pauseWhenADStarts';

export const UA_SHARE_VIDEO = 'sharelink';
export const UA_CHANGE_VIDEO = 'changevideo';
export const UA_SELECT_COURSE = 'selectcourse';

/**
 * Others
 */
export const PROFANITY_LIST = [
  'homo',
  'gay',
  'slut',
  'damn',
  'ass',
  'poop',
  'cock',
  'lol',
  'crap',
  'sex',
  'noob',
  'nazi',
  'neo-nazi',
  'fuck',
  'fucked',
  'bitch',
  'pussy',
  'penis',
  'vagina',
  'whore',
  'shit',
  'nigger',
  'nigga',
  'cocksucker',
  'assrape',
  'motherfucker',
  'wanker',
  'cunt',
  'faggot',
  'fags',
  'asshole',
];
