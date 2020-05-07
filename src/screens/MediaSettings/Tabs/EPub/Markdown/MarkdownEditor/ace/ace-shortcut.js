import { isMac } from 'utils/constants';
import {
    addHeaderText,
    addBoldText,
    addItalicText,
    insertLink
} from './ace-controller';


export function getShortcut(key) {
    return isMac
        ? `<cmd+${key}>`
        : `<ctrl+${key}>`;
}


export function getAceShortcutHandler(ace) {
    /**
     * 
     * @param {KeyboardEvent} event 
     */
    function shortcutHandler(event) {
        let { metaKey, ctrlKey, keyCode } = event;

        if (!metaKey && !ctrlKey) return;
        switch (keyCode) {
            // cmd + h
            case 72:
                addHeaderText(ace);
                break;
            // cmd + b
            case 66:
                addBoldText(ace);
                break;
            // cmd + i
            case 73:
                addItalicText(ace);
                break;
            // cmd + k
            case 75:
                insertLink(ace);
                break;
            default:
                break;
        }
    }

    return shortcutHandler;
}