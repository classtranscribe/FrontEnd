class PlayerConstants {
  // Playback Rates
  static PLAYBACK_RATES = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

  // Player Events
  static CTPE_PLAY = 'play';
  static CTPE_PAUSE = 'pause';
  static CTPE_REWIND = 'rewind';
  static CTPE_FORWARD = 'forward';
  static CTPE_MUTE = 'mute';
  static CTPE_VOLUME_UP = 'volume-up';
  static CTPE_VOLUME_DOWN = 'volume-down';

  // languages
  static ENGLISH = 'en-US';
  static SIMPLIFIED_CHINESE = 'zh-Hans';
  static KOREAN = 'ko';
  static SPANISH = 'es';
  static FRENCH = 'fr';
  static LANG_MAP = {
    [PlayerConstants.ENGLISH]: 'English',
    [PlayerConstants.SIMPLIFIED_CHINESE]: 'Simplified Chinese',
    [PlayerConstants.KOREAN]: 'Korean',
    [PlayerConstants.SPANISH]: 'Spanish',
    [PlayerConstants.FRENCH]: 'French',
  };

  // CC Styles
  // Colors
  static CC_COLOR_WHITE = 'white';
  static CC_COLOR_YELLOW = 'yellow';
  static CC_COLOR_GREEN = 'green';
  static CC_COLOR_CYAN = 'cyan';
  static CC_COLOR_BLUE = 'blue';
  static CC_COLOR_MAGENTA = 'magenta';
  static CC_COLOR_RED = 'red';
  static CC_COLOR_BLACK = 'black';
  static CC_COLORS = [
    PlayerConstants.CC_COLOR_WHITE,
    PlayerConstants.CC_COLOR_YELLOW,
    PlayerConstants.CC_COLOR_GREEN,
    PlayerConstants.CC_COLOR_CYAN,
    PlayerConstants.CC_COLOR_BLUE,
    PlayerConstants.CC_COLOR_MAGENTA,
    PlayerConstants.CC_COLOR_RED,
    PlayerConstants.CC_COLOR_BLACK
  ];
  // Font Sizes
  static CC_FSIZCTPE_50 = 0.5;
  static CC_FSIZCTPE_75 = 0.75;
  static CC_FSIZCTPE_100 = 1;
  static CC_FSIZCTPE_150 = 1.5;
  static CC_FSIZCTPE_200 = 2;
  static CC_FSIZCTPE_300 = 3;
  static CC_FSIZCTPE_400 = 4;
  static CC_FONT_SIZES = [
    PlayerConstants.CC_FSIZCTPE_75,
    PlayerConstants.CC_FSIZCTPE_100,
    PlayerConstants.CC_FSIZCTPE_150,
    PlayerConstants.CC_FSIZCTPE_200,
    PlayerConstants.CC_FSIZCTPE_300,
    PlayerConstants.CC_FSIZCTPE_400,
  ];

  static CC_OPACITY_0 = 0;
  static CC_OPACITY_25 = 0.25;
  static CC_OPACITY_50 = 0.5;
  static CC_OPACITY_75 = 0.75;
  static CC_OPACITY_100 = 1;
  static CC_OPACITIES = [
    PlayerConstants.CC_OPACITY_0,
    PlayerConstants.CC_OPACITY_25,
    PlayerConstants.CC_OPACITY_50,
    PlayerConstants.CC_OPACITY_75,
    PlayerConstants.CC_OPACITY_100,
  ];
}

export default PlayerConstants;