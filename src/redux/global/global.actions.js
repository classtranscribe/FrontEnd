import {
  SET_MODAL,
  SET_PROMPT,
} from './global.action.types'

export const setModal  = value => ({ type: SET_MODAL, value })
export const setPrompt = value => ({ type: SET_PROMPT, value })