import { CTPreference } from './CTPreference';
import { EDITOR_THEME_XCODE, EDITOR_MARKDOWN } from 'screens/MediaSettings/Utils/epub/constants';

const DEFAULT_EDITOR = 'msp-d-editor'; // default content editor
const DEFAULT_EDITOR_THEME = 'msp-ed-theme';

export class MSPPreference extends CTPreference {
  constructor() {
    super();
  }

  init(props) {
    
  }

  defaultEditorTheme(theme) {
    if (theme) {
      return localStorage.getItem(DEFAULT_EDITOR_THEME) || EDITOR_THEME_XCODE;
    }
    localStorage.setItem(DEFAULT_EDITOR_THEME, theme);
  }
  
  defaultEditor(editor) {
    if (editor === undefined) {
      return localStorage.getItem(DEFAULT_EDITOR) || EDITOR_MARKDOWN;
    }
    localStorage.setItem(DEFAULT_EDITOR, editor);
  }
}

export const mspPreference = new MSPPreference();