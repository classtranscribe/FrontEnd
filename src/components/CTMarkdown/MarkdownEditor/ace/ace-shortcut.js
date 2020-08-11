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
      case 72:
        event.preventDefault();
        addHeaderText(ace);
        break;
      // cmd + b
      case 66:
        event.preventDefault();
        addBoldText(ace);
        break;
      // cmd + i
      case 73:
        event.preventDefault();
        addItalicText(ace);
        break;
      // cmd + k
      case 75:
        event.preventDefault();
        insertLink(ace);
        break;
      // cmd + s
      case 83:
        event.preventDefault();
        if (typeof onSave === 'function') onSave();
        break;
      default:
        break;
    }
  }

  return shortcutHandler;
}
