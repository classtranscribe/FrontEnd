import { keydownControl } from './keydown.control';
import * as KeyCode from 'keycode-js';

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
    window.location = { pathname: '/video' };
  });

  afterEach(() => {
    // Restore original location
    window.location = originalLocation;
  });

  describe('basic keyboard shortcuts', () => {
    it('should handle space key for play/pause when no menu is open', () => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_SPACE });
      event.preventDefault = jest.fn();

      keydownControl.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'watch/onPlayPauseClick' 
      });
    });

    it('should handle "k" key for play/pause', () => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_K });
      
      keydownControl.handleKeyDown(event);

      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'watch/onPlayPauseClick' 
      });
    });

    it('should handle "m" key for mute', () => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_M });
      
      keydownControl.handleKeyDown(event);

      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'watch/media_mute' 
      });
    });

    it('should handle left arrow for rewind when no menu is open', () => {
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_LEFT });
      
      keydownControl.handleKeyDown(event);

      expect(mockDispatch).toHaveBeenCalledWith({ 
        type: 'watch/media_backward' 
      });
    });

    it('should not handle shortcuts when not on video page', () => {
      window.location.pathname = '/some-other-page';
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_SPACE });
      
      keydownControl.handleKeyDown(event);

      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });

  describe('menu state', () => {
    it('should not trigger play/pause when menu is open', () => {
      keydownControl.menu = 'some-menu';
      const event = new KeyboardEvent('keydown', { keyCode: KeyCode.KEY_SPACE });
      event.preventDefault = jest.fn();

      keydownControl.handleKeyDown(event);

      expect(event.preventDefault).toHaveBeenCalled();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
}); 