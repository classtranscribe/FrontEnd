import $ from 'jquery';
// import { isDeveloping } from '../../../utils';

import * as KeyCode from 'keycode-js';

import { transControl } from './trans.control';

import {
  MENU_LANGUAGE,
  MENU_SCREEN_MODE,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_SETTING,
  MENU_DOWNLOAD,
  MENU_SHORTCUTS,
  MENU_HIDE,
} from './constants.util';

export const keydownControl = {
  addedKeyDownListener: false,

  keyDownListener(e) {
    // const { keyCode, metaKey, ctrlKey, shiftKey, altKey } = e;
    // if (isDeveloping) console.log('keydown', { keyCode, metaKey, ctrlKey, shiftKey, altKey });
    keydownControl.handleKeyDown(e);
  },

  addKeyDownListener(dispatch) {
    if (this.addedKeyDownListener) return;
    this.dispatch = dispatch;
    document.addEventListener('keydown', this.keyDownListener, true);
    this.addedKeyDownListener = true;
  },
  setMenuModel(menu) {
    this.menu = menu;
  },
  isMenuOpen() {
    return this.menu && this.menu !== MENU_HIDE;
    // return false;
  },
  handleKeyDown(e) {
    if (window.location.pathname !== '/video' && window.location.pathname !== '/liveplayer') {
      document.removeEventListener('keydown', this.keyDownListener, true);
      return;
    }

    const { keyCode, metaKey, ctrlKey, shiftKey, altKey } = e;
    const ctrlKey_ = ctrlKey || metaKey;

    // quit if any <input/>'s are been focusing
    if (this.inputFocusing(e)) return;

    if (ctrlKey_) {
      switch (keyCode) {
        default:
          return;
      }
    }

    if (altKey) {
      switch (keyCode) {
        default:
          return;
      }
    }

    /**
     * Shift Key events
     */
    if (shiftKey) {
      switch (keyCode) {
        // `+` (Shift + +) - increase closed caption size
        case KeyCode.KEY_EQUALS:
          return this.dispatch({ type: 'playerpref/changeCCSizeByValue', payload: 0.25 });
        // `_` (Shift + -) - decrease closed caption
        case KeyCode.KEY_DASH:
          return this.dispatch({ type: 'playerpref/changeCCSizeByValue', payload: -0.25 });
        // `<` (Shift + ,) - switch videos
        case KeyCode.KEY_COMMA:
          return this.dispatch({ type: 'watch/switchVideo' });
        // `?` (Shift + /) - open Search
        case KeyCode.KEY_SLASH:
          e.preventDefault();
          return this.dispatch({ type: 'watch/search_open' });
        // Up Arrow
        case KeyCode.KEY_UP:
          return this.dispatch({ type: 'playerpref/changePlaybackrateByValue', payload: 0.25 });
        // Down Arrow
        case KeyCode.KEY_DOWN:
          return this.dispatch({ type: 'playerpref/changePlaybackrateByValue', payload: -0.25 });

        case KeyCode.KEY_W:
          return this.dispatch({ type: 'playerpref/changeYTranslateByValue', payload: 5 });
          // Down Arrow
        case KeyCode.KEY_S:
          return this.dispatch({ type: 'playerpref/changeYTranslateByValue', payload: -5 });
        case KeyCode.KEY_A:
          return this.dispatch({ type: 'playerpref/changeXTranslateByValue', payload: 5 });
          // Down Arrow
        case KeyCode.KEY_D:
          return this.dispatch({ type: 'playerpref/changeXTranslateByValue', payload: -5 });
        // Menu events
        default:
          return this.shortcutsForMenus(keyCode);
      }
    }

    /**
     * One key events
     */
    switch (keyCode) {
      // ESC
      case KeyCode.KEY_ESCAPE:
        return this.dispatch({type: 'watch/menu_close'})
      // `Space` / `k` : Pause or play
      case KeyCode.KEY_SPACE:
        return this.handleSpaceKey(e);
      // Left Arrow
      case KeyCode.KEY_LEFT:
        return this.handleLeftArrow(e);
      // Up Arrow
      case KeyCode.KEY_UP:
        return this.handleUpArrow(e);
      // Right Arrow
      case KeyCode.KEY_RIGHT:
        return this.handleRightArrow(e);
      // Down Arrow
      case KeyCode.KEY_DOWN:
        return this.handleDownArrow(e);
      // `c` - closed caption on/off
      case KeyCode.KEY_C:
        return this.dispatch({ type: 'playerpref/toggleOpenCC' })
      // `d` - Audio Description on/off
      case KeyCode.KEY_D:
        return this.dispatch({ type: 'playerpref/toggleOpenAD' })
      // Alt + e - edit current caption
      case KeyCode.KEY_E:
        e.preventDefault();
        return transControl.editCurrent();
      // `f` - enter full screen
      case KeyCode.KEY_F:
        return this.dispatch({ type: 'watch/toggleFullScreen' })
      // `j` - rewind 10s
      case KeyCode.KEY_J:
        return this.dispatch({ type: 'watch/media_backward' })
      // `k` - play/pause
      case KeyCode.KEY_K:
        return this.dispatch({ type: 'watch/onPlayPauseClick' })
      // `l` - forward 10s
      case KeyCode.KEY_L:
        return this.dispatch({ type: 'watch/media_forward' })
      // `m` : mute
      case KeyCode.KEY_M:
        return this.dispatch({ type: 'watch/media_mute' })

      // `0-9`: seek to 0%-90% of duration
      case KeyCode.KEY_0:
      case KeyCode.KEY_1:
      case KeyCode.KEY_2:
      case KeyCode.KEY_3:
      case KeyCode.KEY_4:
      case KeyCode.KEY_5:
      case KeyCode.KEY_6:
      case KeyCode.KEY_7:
      case KeyCode.KEY_8:
      case KeyCode.KEY_9:
        return this.dispatch({ type: 'watch/seekToPercentage', payload: ((keyCode - KeyCode.KEY_0) / 10.0) });
      default:
        break;
    }
  },

  inputFocusing(e) {
    if (e.target) {
      if (e.target.localName === 'input' && e.target.type === 'text') return true;
      if (e.target.localName === 'textarea') return true;
      if (e.target.contentEditable === 'true') return true;
    }
  },

  /**
   * Keydown handler for menu-related operations
   * Have to be under `Shift key`
   * @param {Number} keyCode
   * @return {Boolean} - true if it's a menu-related shortcut
   */
  shortcutsForMenus(keyCode) {
    const openMenu = (menuType) => {
      this.dispatch({ type: 'watch/menu_open', payload: { type: menuType, option: 'b' } });
      return true;
    };

    switch (keyCode) {
      // `⇧ Shift + Q` : Close Menu
      case KeyCode.KEY_Q:
        this.dispatch({ type: 'watch/menu_close' })
        return true;
      // `⇧ Shift + C` : Open Closed Caption Setting Menu
      case KeyCode.KEY_C:
        return openMenu(MENU_SETTING);
      // `⇧ Shift + X` : Open Download Menu
      case KeyCode.KEY_X:
        return openMenu(MENU_DOWNLOAD);
      // `⇧ Shift + L` : Open Language Menu
      case KeyCode.KEY_L:
        return openMenu(MENU_LANGUAGE);
      // `⇧ Shift + P` : Open Playlists Menu
      case KeyCode.KEY_P:
        return openMenu(MENU_PLAYLISTS);
      // `⇧ Shift + R` : Open Playback Rates Menu
      case KeyCode.KEY_R:
        return openMenu(MENU_PLAYBACKRATE);
      // `⇧ Shift + M` : Open Screen Mode Menu
      case KeyCode.KEY_M:
        return openMenu(MENU_SCREEN_MODE);
      // Not a menu-related shortcut
      case KeyCode.KEY_BACK_SLASH:
        return openMenu(MENU_SHORTCUTS);
      default:
        return false;
    }
  },

  handleSpaceKey(e) {
    e.preventDefault();
    // If there is no menu opening - play or pause
    if (!this.isMenuOpen()) {
      this.dispatch({ type: 'watch/onPlayPauseClick' })
    }
  },

  /**
   * Function for handling down-arrow key down
   */
  handleDownArrow(e) {
    // If there is no menu opening - decrease the volume by 0.1 each time
    if (!this.isMenuOpen()) {
      $('#volume-slider').focus(); // NEED TO MODIFY
      return;
    }

    // If is focusing on the triggers in control bar - no lower elems
    if ($(`.watch-ctrl-button:focus`).length) {
      return;
    }

    // If it's a slider operation
    if ($('#volume-slider:focus').length || $('#playback-rate-slider:focus').length) {
      return;
    }

    // If menu is open switch the focus on the list items
    const currMenu = this.menu;
    if (currMenu === MENU_SETTING) {
      return;

      // For the playlists menu
      // Focus on the next playlist or video item
    }
    if (currMenu === MENU_PLAYLISTS) {
      e.preventDefault();
      this.keydownForPlaylistsMenu('down');
    } else if (currMenu === MENU_SHORTCUTS) {
      // Operations for language, playback rate,
      // download, and screen mode menus
    } else {
      const currFocusElem = $('.watch-icon-listitem:focus');
      let nextElem = null;
      // If there is a focused item, focus its next one
      if (currFocusElem.length) {
        nextElem = currFocusElem.next();
        // If no existing focused item, focus on the first one
      } else {
        nextElem = $('.watch-icon-listitem:first-child');
      }

      if (nextElem.length) {
        nextElem.focus();
        // if it's the last one, focus on menu trigger
      } else {
        $(`#${currMenu}`).focus();
      }
    }
  },

  /**
   * Function for handling up-arrow key down
   */
  handleUpArrow(e) {
    // If there is no menu opening - increment the volume by 0.1 each time
    if (!this.isMenuOpen()) {
      if ($(`.watch-ctrl-button:focus`).length) {
        /**
         * @TODO need to modify when finish transcription part
         */
        document.activeElement.blur();
      } else {
        $('#volume-slider').focus();
      }
      return;
    }

    // If it's a slider operation
    if ($('#volume-slider:focus').length || $('#playback-rate-slider:focus').length) {
      return;
    }

    // If is focusing on the close button - no upper elems
    if ($(`.watch-menu-close-btn:focus`).length) {
      return;
    }

    // If menu is open switch the focus on the list items
    const currMenu = this.menu;
    if (currMenu === MENU_SETTING) {
      return;

      // For the playlists menu
      // Focus on the previous playlist or video item
    }
    if (currMenu === MENU_PLAYLISTS) {
      e.preventDefault();
      this.keydownForPlaylistsMenu('up');
    } else if (currMenu === MENU_SHORTCUTS) {
      // Operations for language, playback rate,
      // download, and screen mode menus
    } else {
      const currFocusElem = $('.watch-icon-listitem:focus');
      let nextElem = null;
      // If there is a focused item, focus its previous one
      if (currFocusElem.length) {
        nextElem = currFocusElem.prev();
        // If no existing focused item, focus on the last one
      } else {
        nextElem = $('.watch-icon-listitem:last-child');
      }

      if (nextElem.length) {
        nextElem.focus();
        // if it's the first one, focus on the close btn
      } else {
        $(`.watch-menu-close-btn`).focus();
      }
    }
  },

  /**
   * Function for handling left-arrow key down
   */
  handleLeftArrow(e) {
    const skipBtnFocus = $('.skip-btn:focus');
    if (skipBtnFocus.length) {
      skipBtnFocus.prev().focus();
      return;
    }
    // If is focusing on the volume slider,
    // then focus on the volume mute trigger
    if ($('#volume-slider:focus').length) {
      $('#volume-mute-btn').focus();
      return;
    }
    // If is focusing on the volume mute button,
    // then focus on the switch screen trigger
    if ($('#volume-mute-btn:focus').length) {
      const switchScreenBtnElem = $('#switch-screen-btn');
      if (switchScreenBtnElem.length) switchScreenBtnElem.focus();
      else $('#play-btn').focus();
      return;
    }
    // if is focusing on the playback rate menu trigger
    // focus on the volume slider
    if ($(`#${MENU_PLAYBACKRATE}:focus`).length) {
      $('#volume-slider').focus();
      return;
    }

    // If it's other triggers in the control bar
    // focus on its previous one
    const menuTriggerFocusElem = $(`.watch-ctrl-button:focus`);
    if (menuTriggerFocusElem.length) {
      menuTriggerFocusElem.prev().focus();
      return;
    }

    if (!this.isMenuOpen()) {
      // NEED TO MODIFY
      return this.dispatch({ type: 'watch/media_backward' })
    }

    const currMenu = this.menu;

    if (currMenu === MENU_SETTING) {
      // For the playlists menu
      // Focus on the current playlist elem
    } else if (currMenu === MENU_PLAYLISTS) {
      e.preventDefault();
      this.keydownForPlaylistsMenu('left');

      // For the playback rate menu
      // focus on the slider
    } else if (currMenu === MENU_PLAYBACKRATE) {
      const sliderElem = $('.playbackrate-slider');
      sliderElem.focus();

      // Operations for simple menus,
      // i.e. language, download, and screen mode menus
    }
  },

  /**
   * Function for handling right-arrow key down
   */
  handleRightArrow(e) {
    const skipBtnFocus = $('.skip-btn:focus');
    if (skipBtnFocus.length) {
      skipBtnFocus.next().focus();
      return;
    }

    // If is focusing on the volume slider,
    // then focus on the playback rate menu trigger
    if ($('#volume-slider:focus').length) {
      $(`#${MENU_PLAYBACKRATE}`).focus();
      return;
    }

    // If is focusing on the switch screen trigger
    // then focus on the  volume mute button
    if (!$('#switch-screen-btn').length) {
      if ($('#play-btn:focus').length) {
        $('#volume-mute-btn').focus();
        return;
      }
    }

    if ($('#switch-screen-btn:focus').length) {
      $('#volume-mute-btn').focus();
      return;
    }

    // If it's other triggers in the control bar
    // focus on its next one
    const menuTriggerFocusElem = $(`.watch-ctrl-button:focus`);
    if (menuTriggerFocusElem.length) {
      menuTriggerFocusElem.next().focus();
      return;
    }

    if (!this.isMenuOpen()) {
      return this.dispatch({ type: 'watch/media_forward' })
    }

    const currMenu = this.menu;
    if (currMenu === MENU_SETTING) {
      // For the playlists menu
      // Focus on the first video card elem
    } else if (currMenu === MENU_PLAYLISTS) {
      e.preventDefault();
      this.keydownForPlaylistsMenu('right');

      // For the playback rate menu
      // focus on first elem of list items
    } else if (currMenu === MENU_PLAYBACKRATE) {
      const sliderFocusElem = $('.playbackrate-slider:focus');
      // console.log(sliderFocusElem)
      if (sliderFocusElem.length) {
        sliderFocusElem.blur();
        $('.watch-icon-listitem:first-child').focus();
      }

      // Operations for simple menus,
      // i.e. language, download, and screen mode menus
    }
  },

  keydownForPlaylistsMenu(type) {
    const playlistFocusElem = $('.watch-playlist-item:focus');
    const videoCardFocusElem = $('.video-card:focus');
    let videoCardFirstChild = $('.video-card[current=true]');
    if (!videoCardFirstChild.length) {
      videoCardFirstChild = $('.video-card')[0];
    }
    switch (type) {
      // Down
      case 'down':
        if (playlistFocusElem.length) {
          playlistFocusElem.next().focus();
        } else if (videoCardFocusElem.length) {
          videoCardFocusElem
            .parent()
            .parent()
            .next()
            .children('.video-card-container-row')
            .children('.video-card')
            .focus();
        } else if (videoCardFirstChild) videoCardFirstChild.focus();
        return;
      // Up
      case 'up':
        if (playlistFocusElem.length) {
          const prevPlaylistElem = playlistFocusElem.prev();
          if (prevPlaylistElem.length) {
            prevPlaylistElem.focus();
          } else {
            $('.watch-menu-close-btn').focus();
          }
        } else if (videoCardFocusElem.length) {
          const prevVideoCardElem = videoCardFocusElem
            .parent()
            .parent()
            .prev()
            .children('.video-card-container-row')
            .children('.video-card');
          if (prevVideoCardElem.length) {
            prevVideoCardElem.focus();
          } else {
            $('.watch-menu-close-btn').focus();
          }
        } else {
          let lastVideoCardElem = $('.video-card[current=true]');
          if (!lastVideoCardElem.length)
            lastVideoCardElem = $('.watch-video-item:last-child')
              .children('.video-card-container-row')
              .children('.video-card');
          lastVideoCardElem.focus();
        }
        return;
      case 'right':
        playlistFocusElem.click();
        videoCardFirstChild = $('.video-card[current=true]');
        if (!videoCardFirstChild.length) {
          videoCardFirstChild = $('.video-card')[0];
        }
        if (!$('.video-card:focus').length) {
          if (videoCardFirstChild) {
            videoCardFirstChild.focus();
          }
        } else {
          $('.watch-menu-close-btn').focus();
        }
        return;
      case 'left':
        if ($('.watch-menu-close-btn:focus').length) {
          if (videoCardFirstChild) videoCardFirstChild.focus();
        } else if (!$('.watch-playlist-item:focus').length) {
          $('.watch-playlist-item[active=true]').focus();
        }

        break;
      default:
        break;
    }
  },

  openTabHelper() {
    $('#skip-to-ctrl-bar').focus();
  },
  skipToControlBar() {
    $('#play-btn').focus();
  },
  skipToCaptionBox() {
    $('#trans-setting-btn').focus();
  },
  skipToContinue() {
    $('#brand').focus();
  },
};
