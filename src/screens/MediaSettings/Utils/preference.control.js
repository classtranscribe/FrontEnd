import { CTPreference } from '../../../utils'

const DEFAULT_EDITOR = 'msp-d-editor' // default content editor

export class MSPPreference extends CTPreference {
  constructor() {
    super()
  }

  init(props) {
    
  }
  
  defaultEditor(editor) {
    if (editor === undefined) {
      return localStorage.getItem(DEFAULT_EDITOR) || ''
    }
    localStorage.setItem(DEFAULT_EDITOR, editor)
  }
}

export const prefControl = new MSPPreference()