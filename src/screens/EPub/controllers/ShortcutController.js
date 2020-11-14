import { elem } from 'utils';
import ID from './constants/EPubIDs';
import Constants from './constants/EPubConstants';
import { epubState } from './EPubStateManager';
import { epubData } from './EPubDataController';

class ShortcutController {
  constructor() {
    this.__disabled = false;

    this.removeKeydownListener = this.removeKeydownListener.bind(this);
  }

  get epubMainEl() {
    return elem.getElement(ID.EPubMainID);
  }

  addKeydownListener() {
    const epubMainEl = this.epubMainEl;
    if (epubMainEl) {
      epubMainEl.tabIndex = "0";
      epubMainEl.focus();
      epubMainEl.removeEventListener('keydown', this.onKeyDown, true);
      epubMainEl.addEventListener('keydown', this.onKeyDown, true);
    }
  }

  removeKeydownListener() {
    const chListEl = this.chListEl;
    if (chListEl) {
      chListEl.removeEventListener('keydown', this.onKeyDown, true);
    }
  }

  shouldDisable() {
    const activeEl = document.activeElement;
    return activeEl.getAttribute('contenteditable') 
          || activeEl.tagName === 'input' 
          || activeEl.tagName === 'textarea';
  }

  /**
   * @param {KeyboardEvent} event
   */
  onKeyDown = (event) => {
    const { keyCode, metaKey, shiftKey } = event;
    if (this.shouldDisable()) {
      return;
    }

    // console.log('keyCode, metaKey, shiftKey', keyCode, metaKey, shiftKey);

    if (!metaKey) return;
    // Meta key actions
    switch (keyCode) {
      case 49: // 1
      case 50: // 2
      case 51: // 3
        return this.onSwitchView(event, keyCode - 49);
      case 66: // b
        return this.onToggleNav(event);
      case 83: // s
        return this.onSave(event);
      case 90: // z
        return this.onUndo(event);
      case 191: // /
        return this.onOpenShortcuts(event);
      default:
        break;
    }

    if (!shiftKey) return;
    // Shift + Meta key actions
    switch (keyCode) {
      case 80: // p
        return this.onPreview(event);
      case 90: // z
        return this.onRedo(event);
      default:
        break;
    }
  }

  preventDefault(e) {
    e.preventDefault();
  }
  
  onSwitchView(e, number) {
    this.preventDefault(e);
    epubState.setView(Constants.EPubViews[number]);
  }

  onUndo(e) {
    this.preventDefault(e);
    if (epubState.view !== Constants.EpbReadOnly && epubData.history.canUndo) {
      epubData.history.undo();
    }
  }

  onRedo(e) {
    this.preventDefault(e);
    if (epubState.view !== Constants.EpbReadOnly && epubData.history.canRedo) {
      epubData.history.redo();
    }
  }

  onPreview(e) {
    this.preventDefault(e);
    if (epubState.view !== Constants.EpbReadOnly) {
      if (epubState.showPreview) {
        epubState.setShowPreview(false);
      } else {
        epubState.setShowPreview(true);
      }
    }
  }

  onOpenShortcuts(e) {
    this.preventDefault(e);
    if (epubState.showShortcuts) {
      epubState.setShowShortcuts(false);
    } else {
      epubState.setShowShortcuts(true);
    }
  }

  onToggleNav(e) {
    this.preventDefault(e);
    if (epubState.showNav) {
      epubState.setShowNav(false);
    } else {
      epubState.setShowNav(true);
    }
  }

  onSave(e) {
    this.preventDefault(e);
    epubData.saveEPub(0);
  }
}

export default ShortcutController;
export const shortcut = new ShortcutController();