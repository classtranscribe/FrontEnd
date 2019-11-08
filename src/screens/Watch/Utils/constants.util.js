/**
* constants
*/

// Screen Modes
export const NORMAL_MODE = 'normal-mode'
export const THEATRE_MODE = 'theatre-mode'
export const PS_MODE = 'ps-mode'
export const EQUAL_MODE = 'equal-mode'
export const NESTED_MODE = 'nested-mode'

export const screenModes = [
  { type: NORMAL_MODE, name: 'Primary View', icon: 'video_label' },
  { type: THEATRE_MODE, name: 'Theatre View', icon: 'video_label' },
  { type: PS_MODE, name: 'Primary-Secondary View', icon: 'view_carousel' },
  { type: NESTED_MODE, name: 'Nested View', icon: 'featured_video' },
]

// Player types
export const PRIMARY = 'ct-player-primary'
export const SECONDARY = 'ct-player-secondary'

// Menu types 
export const MENU_HIDE = 'menu-hide'
export const MENU_BEFORE_HIDE = 'menu-before-hide'
export const MENU_PLAYLISTS = 'menu-playlists'
export const MENU_PLAYBACKRATE = 'menu-playbackrate'
export const MENU_CAPTIONS = 'menu-captions'
export const MENU_LANGUAGE = 'menu-language'
export const MENU_SCREEN_MODE = 'menu-screen-mode'
export const MENU_DOWNLOAD = 'menu-download'

// Caption Languages
export const ENGLISH = 'en-US'
export const SIMPLIFIED_CHINESE = 'zh-Hans'
export const KOREAN = 'ko'
export const SPANISH = 'es'
export const langOptions = [ ENGLISH, SIMPLIFIED_CHINESE, KOREAN, SPANISH ]
export const langMap = {
  "en-US": "English",
  "zh-Hans": "Simplified Chinese",
  "ko": "Korean",
  "es": "Spanish"
}

// Caption Search Options
export const SEARCH_IN_COURSE = 'search-in-course'
export const SEARCH_IN_VIDEO = 'search-in-video'

// Player static options
export const AUTOPLAY = false
export const playbackRateOptions = [.25, .5, .75, 1, 1.25, 1.5, 1.75, 2/*, 3, 4*/]

// CC Setting
export const CC_COLOR_WHITE = 'white'
export const CC_COLOR_BLACK = 'black'
export const CC_COLOR_GREEN = 'green'
export const CC_COLOR_BLUE  = 'blue'
export const CC_COLOR_CYAN = 'cyan'
export const CC_COLOR_RED = 'red'
export const CC_COLOR_MAGENTA  = 'magenta'
export const CC_COLOR_YELLOW = 'yellow'
export const cc_colorOptions = [ CC_COLOR_WHITE, CC_COLOR_CYAN, CC_COLOR_BLUE, CC_COLOR_GREEN, CC_COLOR_RED, CC_COLOR_MAGENTA, CC_COLOR_YELLOW, CC_COLOR_BLACK ]

export const CC_FONT_SERIF = 'serif'
export const CC_FONT_SANS_SERIF = 'sans-serif'
export const CC_FONT_MONOSPACE = 'monospace'
export const CC_FONT_CURSIVE = 'cursive'
export const CC_FONT_FANTASY = 'fantasy'
export const cc_fontOptions = [ CC_FONT_SERIF, CC_FONT_SANS_SERIF, CC_FONT_MONOSPACE, CC_FONT_MONOSPACE, CC_FONT_CURSIVE, CC_FONT_FANTASY ]

export const CC_SIZE_75 = .75
export const CC_SIZE_100 = 1
export const CC_SIZE_125 = 1.25
export const CC_SIZE_175 = 1.75
export const CC_SIZE_200 = 2
export const cc_sizeOptions = [ CC_SIZE_75, CC_SIZE_100, CC_SIZE_125, CC_SIZE_175, CC_SIZE_200 ]

export const CC_OPACITY_0 = 0
export const CC_OPACITY_25 = .25
export const CC_OPACITY_50 = .5
export const CC_OPACITY_75 = .75
export const CC_OPACITY_100 = 1
export const cc_opacityOptions = [ CC_OPACITY_0, CC_OPACITY_25, CC_OPACITY_50, CC_OPACITY_75, CC_OPACITY_100 ]

export const CC_POSITION_TOP = 'top'
export const CC_POSITION_BOTTOM = 'bottom'
export const CC_POSITION_UNDER = 'under video'
export const cc_positionOptions = [ CC_POSITION_TOP, CC_POSITION_BOTTOM, CC_POSITION_UNDER ]