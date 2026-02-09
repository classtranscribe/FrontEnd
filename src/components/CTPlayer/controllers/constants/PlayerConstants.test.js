import PlayerConstants from './PlayerConstants';

describe('PlayerConstants', () => {
  describe('Media Errors', () => {
    it('exports MediaError404', () => {
      expect(PlayerConstants.MediaError404).toBe(404);
    });

    it('exports MediaError401', () => {
      expect(PlayerConstants.MediaError401).toBe(401);
    });
  });

  describe('Player Sizes', () => {
    it('exports PlayerSizeSmall', () => {
      expect(PlayerConstants.PlayerSizeSmall).toBe('xs');
    });

    it('exports PlayerSizeMedium', () => {
      expect(PlayerConstants.PlayerSizeMedium).toBe('md');
    });

    it('exports PlayerSizeLarge', () => {
      expect(PlayerConstants.PlayerSizeLarge).toBe('lg');
    });
  });

  describe('Playback Rates', () => {
    it('exports PlaybackRates array', () => {
      expect(Array.isArray(PlayerConstants.PlaybackRates)).toBe(true);
    });

    it('includes standard playback rates', () => {
      expect(PlayerConstants.PlaybackRates).toContain(1);
      expect(PlayerConstants.PlaybackRates).toContain(1.5);
      expect(PlayerConstants.PlaybackRates).toContain(2);
    });

    it('has 8 playback rates', () => {
      expect(PlayerConstants.PlaybackRates.length).toBe(8);
    });

    it('includes rates in descending order', () => {
      expect(PlayerConstants.PlaybackRates[0]).toBe(2);
      expect(PlayerConstants.PlaybackRates[7]).toBe(0.25);
    });
  });

  describe('Player Events', () => {
    it('exports PlayerEventPlay', () => {
      expect(PlayerConstants.PlayerEventPlay).toBe('play');
    });

    it('exports PlayerEventPause', () => {
      expect(PlayerConstants.PlayerEventPause).toBe('pause');
    });

    it('exports PlayerEventRewind', () => {
      expect(PlayerConstants.PlayerEventRewind).toBe('rewind');
    });

    it('exports PlayerEventForward', () => {
      expect(PlayerConstants.PlayerEventForward).toBe('forward');
    });

    it('exports PlayerEventMute', () => {
      expect(PlayerConstants.PlayerEventMute).toBe('mute');
    });

    it('exports PlayerEventVolumeUp', () => {
      expect(PlayerConstants.PlayerEventVolumeUp).toBe('volume-up');
    });

    it('exports PlayerEventVolumeDown', () => {
      expect(PlayerConstants.PlayerEventVolumeDown).toBe('volume-down');
    });
  });

  describe('Screen Modes', () => {
    it('exports ScreenModePrimary', () => {
      expect(PlayerConstants.ScreenModePrimary).toBe('p-s');
    });

    it('exports ScreenModeNested', () => {
      expect(PlayerConstants.ScreenModeNested).toBe('nest');
    });

    it('exports ScreenModeNormal', () => {
      expect(PlayerConstants.ScreenModeNormal).toBe('normal');
    });

    it('exports ScreenModesMap with readable names', () => {
      expect(PlayerConstants.ScreenModesMap['p-s']).toBe('Primary-Secondary View');
      expect(PlayerConstants.ScreenModesMap.nest).toBe('Nested View');
      expect(PlayerConstants.ScreenModesMap.normal).toBe('One-Screen View');
    });
  });

  describe('CC Colors', () => {
    it('exports color constants', () => {
      expect(PlayerConstants.CCColorWhite).toBe('white');
      expect(PlayerConstants.CCColorYellow).toBe('yellow');
      expect(PlayerConstants.CCColorGreen).toBe('green');
      expect(PlayerConstants.CCColorCyan).toBe('cyan');
      expect(PlayerConstants.CCColorBlue).toBe('blue');
      expect(PlayerConstants.CCColorMagenta).toBe('magenta');
      expect(PlayerConstants.CCColorRed).toBe('red');
      expect(PlayerConstants.CCColorBlack).toBe('black');
    });

    it('exports CCColors array with all colors', () => {
      expect(PlayerConstants.CCColors.length).toBe(8);
      expect(PlayerConstants.CCColors).toContain('white');
      expect(PlayerConstants.CCColors).toContain('black');
    });
  });

  describe('CC Font Sizes', () => {
    it('exports font size constants', () => {
      expect(PlayerConstants.CCFontSize50).toBe(0.5);
      expect(PlayerConstants.CCFontSize75).toBe(0.75);
      expect(PlayerConstants.CCFontSize100).toBe(1);
      expect(PlayerConstants.CCFontSize150).toBe(1.5);
      expect(PlayerConstants.CCFontSize200).toBe(2);
      expect(PlayerConstants.CCFontSize300).toBe(3);
      expect(PlayerConstants.CCFontSize400).toBe(4);
    });

    it('exports CCFontSizes array', () => {
      expect(PlayerConstants.CCFontSizes.length).toBe(6);
      expect(PlayerConstants.CCFontSizes).toContain(1);
      expect(PlayerConstants.CCFontSizes).toContain(2);
    });
  });

  describe('CC Opacity', () => {
    it('exports opacity constants', () => {
      expect(PlayerConstants.CCOpacity0).toBe(0);
      expect(PlayerConstants.CCOpacity25).toBe(0.25);
      expect(PlayerConstants.CCOpacity50).toBe(0.5);
      expect(PlayerConstants.CCOpacity75).toBe(0.75);
      expect(PlayerConstants.CCOpacity100).toBe(1);
    });

    it('exports CCOpacities array', () => {
      expect(PlayerConstants.CCOpacities.length).toBe(5);
      expect(PlayerConstants.CCOpacities).toContain(0);
      expect(PlayerConstants.CCOpacities).toContain(1);
    });
  });

  describe('CC Position', () => {
    it('exports position constants', () => {
      expect(PlayerConstants.CCPositionBottom).toBe('bottom');
      expect(PlayerConstants.CCPositionTop).toBe('top');
      expect(PlayerConstants.CCPositionOutside).toBe('outside');
    });
  });
});
