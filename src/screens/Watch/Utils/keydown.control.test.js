import { keydownControl } from './keydown.control';
import * as KeyCode from 'keycode-js';
import {
  MENU_LANGUAGE,
  MENU_SCREEN_MODE,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_SETTING,
  MENU_DOWNLOAD,
  MENU_SHORTCUTS
} from './constants.util';

describe('keydownControl', () => {
  let mockDispatch;
  let originalLocation;

  beforeEach(() => {
    mockDispatch = jest.fn();
    keydownControl.dispatch = mockDispatch;
    keydownControl.menu = null;

    // Save original location
    originalLocation = window.location;

    // Mock window.location
    delete window.location;
    // This is because we only enable the keydown on /video or /liveplayer
    window.location = { pathname: '/video' }; 
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
  });

  // Helper function to create and dispatch keyboard events
  const pressKey = (keyCode, options = {}) => {
    const event = new KeyboardEvent('keydown', { 
      keyCode,
      ...options
    });
    if (options.preventDefault) {
      event.preventDefault = jest.fn();
    }
    keydownControl.handleKeyDown(event);
    return event;
  };

  // Helper function to test dispatch calls
  const expectDispatch = (keyCode, expectedAction, options = {}) => {
    const event = pressKey(keyCode, options);
    expect(mockDispatch).toHaveBeenCalledWith(expectedAction);
    if (options.preventDefault) {
      expect(event.preventDefault).toHaveBeenCalled();
    }
  };

  describe('basic keyboard shortcuts', () => {
    it('should handle space key for play/pause when no menu is open', () => {
      expectDispatch(
        KeyCode.KEY_SPACE, 
        { type: 'watch/onPlayPauseClick' },
        { preventDefault: true }
      );
    });

    it('should handle "k" key for play/pause', () => {
      expectDispatch(
        KeyCode.KEY_K,
        { type: 'watch/onPlayPauseClick' }
      );
    });

    it('should handle "m" key for mute', () => {
      expectDispatch(
        KeyCode.KEY_M,
        { type: 'watch/media_mute' }
      );
    });

    it('should handle left arrow for rewind when no menu is open', () => {
      expectDispatch(
        KeyCode.KEY_LEFT,
        { type: 'watch/media_backward' }
      );
    });

    it('should not handle shortcuts when not on video page', () => {
      window.location.pathname = '/some-other-page';
      pressKey(KeyCode.KEY_SPACE);
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('should handle "j" key for rewind', () => {
      expectDispatch(
        KeyCode.KEY_J,
        { type: 'watch/media_backward' }
      );
    });

    it('should handle "l" key for forward', () => {
      expectDispatch(
        KeyCode.KEY_L,
        { type: 'watch/media_forward' }
      );
    });

    it('should handle "f" key for fullscreen', () => {
      expectDispatch(
        KeyCode.KEY_F,
        { type: 'watch/toggleFullScreen' }
      );
    });

    it('should handle "c" key for closed captions', () => {
      expectDispatch(
        KeyCode.KEY_C,
        { type: 'playerpref/toggleOpenCC' }
      );
    });

    it('should handle "d" key for audio description', () => {
      expectDispatch(
        KeyCode.KEY_D,
        { type: 'playerpref/toggleOpenAD' }
      );
    });

    it('should handle right arrow for forward when no menu is open', () => {
      expectDispatch(
        KeyCode.KEY_RIGHT,
        { type: 'watch/media_forward' }
      );
    });

    it('should handle number keys 0-9 for seeking to percentage', () => {
      for(let i = 0; i <= 9; i++) {
        expectDispatch(
          KeyCode[`KEY_${i}`],
          { 
            type: 'watch/seekToPercentage',
            payload: i/10
          }
        );
        mockDispatch.mockClear();
      }
    });

    it('should handle ESC key to close menu', () => {
      expectDispatch(
        KeyCode.KEY_ESCAPE,
        { type: 'watch/menu_close' }
      );
    });

    it('should not trigger play/pause when menu is open', () => {
      keydownControl.menu = 'some-menu';
      const event = pressKey(KeyCode.KEY_SPACE, { preventDefault: true });
      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('shift key combinations', () => {
    const withShift = { shiftKey: true };

    it('should handle Shift + ESC to stop audio description', () => {
      expectDispatch(
        KeyCode.KEY_ESCAPE,
        { 
          type: 'playerpref/setPreference',
          payload: { stopAD: true }
        },
        withShift
      );
    });

    it('should handle Shift + = to increase caption size', () => {
      expectDispatch(
        KeyCode.KEY_EQUALS,
        { 
          type: 'playerpref/changeCCSizeByValue',
          payload: 0.25
        },
        withShift
      );
    });

    it('should handle Shift + - to decrease caption size', () => {
      expectDispatch(
        KeyCode.KEY_DASH,
        { 
          type: 'playerpref/changeCCSizeByValue',
          payload: -0.25
        },
        withShift
      );
    });

    it('should handle Shift + UP to increase playback rate', () => {
      expectDispatch(
        KeyCode.KEY_UP,
        { 
          type: 'playerpref/changePlaybackrateByValue',
          payload: 0.25
        },
        withShift
      );
    });

    it('should handle Shift + DOWN to decrease playback rate', () => {
      expectDispatch(
        KeyCode.KEY_DOWN,
        { 
          type: 'playerpref/changePlaybackrateByValue',
          payload: -0.25
        },
        withShift
      );
    });

    it('should handle Shift + / to open search', () => {
      expectDispatch(
        KeyCode.KEY_SLASH,
        { type: 'watch/search_open' },
        withShift
      );
    });
  });

  describe('caption position controls', () => {
    it('should handle Shift + W to move captions up', () => {
      expectDispatch(
        KeyCode.KEY_W,
        { 
          type: 'playerpref/changeYTranslateByValue',
          payload: 5
        },
        { shiftKey: true }
      );
    });

    it('should handle Shift + S to move captions down', () => {
      expectDispatch(
        KeyCode.KEY_S,
        { 
          type: 'playerpref/changeYTranslateByValue',
          payload: -5
        },
        { shiftKey: true }
      );
    });

    it('should handle Shift + A to move captions left', () => {
      expectDispatch(
        KeyCode.KEY_A,
        { 
          type: 'playerpref/changeXTranslateByValue',
          payload: 5
        },
        { shiftKey: true }
      );
    });

    it('should handle Shift + D to move captions right', () => {
      expectDispatch(
        KeyCode.KEY_D,
        { 
          type: 'playerpref/changeXTranslateByValue',
          payload: -5
        },
        { shiftKey: true }
      );
    });
  });

  describe('menu shortcuts', () => {
    const withShift = { shiftKey: true };

    it('should handle Shift + Q to close menu', () => {
      expectDispatch(
        KeyCode.KEY_Q,
        { type: 'watch/menu_close' },
        withShift
      );
    });

    it('should handle Shift + C to open settings menu', () => {
      expectDispatch(
        KeyCode.KEY_C,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_SETTING, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + X to open download menu', () => {
      expectDispatch(
        KeyCode.KEY_X,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_DOWNLOAD, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + L to open language menu', () => {
      expectDispatch(
        KeyCode.KEY_L,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_LANGUAGE, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + P to open playlists menu', () => {
      expectDispatch(
        KeyCode.KEY_P,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_PLAYLISTS, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + R to open playback rates menu', () => {
      expectDispatch(
        KeyCode.KEY_R,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_PLAYBACKRATE, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + M to open screen mode menu', () => {
      expectDispatch(
        KeyCode.KEY_M,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_SCREEN_MODE, option: 'b' }
        },
        withShift
      );
    });

    it('should handle Shift + \\ to open shortcuts menu', () => {
      expectDispatch(
        KeyCode.KEY_BACK_SLASH,
        { 
          type: 'watch/menu_open',
          payload: { type: MENU_SHORTCUTS, option: 'b' }
        },
        withShift
      );
    });
  });

  describe('edit mode shortcuts', () => {
    it.skip('should handle Alt + E to edit current caption', () => {
      // Skipping this test until we properly mock trans.control
    });
  });
}); 