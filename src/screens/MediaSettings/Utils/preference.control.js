import { CTPreference } from '../../../utils'

const DEFAULT_EDITOR = 'msp-d-editor' // default content editor
const DARK_EDITOR = 'msp-dark-editor'

export class MSPPreference extends CTPreference {
  constructor() {
    super()

    this[DARK_EDITOR] = this.isTrue(DARK_EDITOR)
  }

  init(props) {
    
  }

  darkEditor(bool) {
    return this.localStorage(DARK_EDITOR, bool)
  }
  
  defaultEditor(editor) {
    if (editor === undefined) {
      return localStorage.getItem(DEFAULT_EDITOR) || ''
    }
    localStorage.setItem(DEFAULT_EDITOR, editor)
  }
}

export const prefControl = new MSPPreference()