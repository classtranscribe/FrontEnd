import * as KeyCode from 'keycode-js';
import { isMac } from 'utils/constants';
import { addHeaderText, addBoldText, addItalicText, insertLink } from './ace-controller';

export function getShortcut(key) {
  return isMac ? `<cmd+${key}>` : `<ctrl+${key}>`;
}

export function getAceShortcutHandler(ace, onSave, onClose) {
  /**
   *
   * @param {KeyboardEvent} event
   */
  function shortcutHandler(event) {
    const { metaKey, ctrlKey, keyCode } = event;

    if (!metaKey && !ctrlKey) return;
    switch (keyCode) {
      // cmd + h
      case KeyCode.KEY_H:
        event.preventDefault();
        addHeaderText(ace);
        break;
      // cmd + b
      case KeyCode.KEY_B:
        event.preventDefault();
        addBoldText(ace);
        break;
      // cmd + i
      case KeyCode.KEY_I:
        event.preventDefault();
        addItalicText(ace);
        break;
      // cmd + k
      case KeyCode.KEY_K:
        event.preventDefault();
        insertLink(ace);
        break;
      // cmd + s
      case KeyCode.KEY_S:
        event.preventDefault();
        if (typeof onSave === 'function') onSave();
        break;
      default:
        break;
    }
  }

  return shortcutHandler;
}
