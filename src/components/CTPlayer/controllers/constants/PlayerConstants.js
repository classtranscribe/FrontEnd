/**
 * The class contains all the static values for the video player
 */
class PlayerConstants {
  // Player Errors
  static MediaError404 = 404;
  static MediaError401 = 401;

  // Player Size
  static PlayerSizeSmall = 'xs';
  static PlayerSizeMedium = 'md';
  static PlayerSizeLarge = 'lg';

  // Playback Rates
  static PlaybackRates = [2, 1.75, 1.5, 1.25, 1, 0.75, 0.5, 0.25];

  /// ///////////////////////////////////////////////////////////////////
  // Player Events
  /// ///////////////////////////////////////////////////////////////////
  static PlayerEventPlay = 'play';
  static PlayerEventPause = 'pause';
  static PlayerEventRewind = 'rewind';
  static PlayerEventForward = 'forward';
  static PlayerEventMute = 'mute';
  static PlayerEventVolumeUp = 'volume-up';
  static PlayerEventVolumeDown = 'volume-down';

  /// ///////////////////////////////////////////////////////////////////
  // Screen Modes
  /// ///////////////////////////////////////////////////////////////////
  static ScreenModePrimary = 'p-s';
  static ScreenModeNested = 'nest';
  static ScreenModeNormal = 'normal';
  static ScreenModesMap = {
    [PlayerConstants.ScreenModePrimary]: 'Primary-Secondary View',
    [PlayerConstants.ScreenModeNested]: 'Nested View',
    [PlayerConstants.ScreenModeNormal]: 'One-Screen View'
  };


  /// ///////////////////////////////////////////////////////////////////
  // CC Styles
  /// ///////////////////////////////////////////////////////////////////
  // Colors
  static CCColorWhite = 'white';
  static CCColorYellow = 'yellow';
  static CCColorGreen = 'green';
  static CCColorCyan = 'cyan';
  static CCColorBlue = 'blue';
  static CCColorMagenta = 'magenta';
  static CCColorRed = 'red';
  static CCColorBlack = 'black';
  static CCColors = [
    PlayerConstants.CCColorWhite,
    PlayerConstants.CCColorYellow,
    PlayerConstants.CCColorGreen,
    PlayerConstants.CCColorCyan,
    PlayerConstants.CCColorBlue,
    PlayerConstants.CCColorMagenta,
    PlayerConstants.CCColorRed,
    PlayerConstants.CCColorBlack
  ];
  // Font Sizes
  static CCFontSize50 = 0.5;
  static CCFontSize75 = 0.75;
  static CCFontSize100 = 1;
  static CCFontSize150 = 1.5;
  static CCFontSize200 = 2;
  static CCFontSize300 = 3;
  static CCFontSize400 = 4;
  static CCFontSizes = [
    PlayerConstants.CCFontSize75,
    PlayerConstants.CCFontSize100,
    PlayerConstants.CCFontSize150,
    PlayerConstants.CCFontSize200,
    PlayerConstants.CCFontSize300,
    PlayerConstants.CCFontSize400,
  ];
  // Opacity
  static CCOpacity0 = 0;
  static CCOpacity25 = 0.25;
  static CCOpacity50 = 0.5;
  static CCOpacity75 = 0.75;
  static CCOpacity100 = 1;
  static CCOpacities = [
    PlayerConstants.CCOpacity0,
    PlayerConstants.CCOpacity25,
    PlayerConstants.CCOpacity50,
    PlayerConstants.CCOpacity75,
    PlayerConstants.CCOpacity100,
  ];
  // position
  static CCPositionBottom = 'bottom';
  static CCPositionTop = 'top';
  static CCPositionOutside = 'outside';
}

export default PlayerConstants;