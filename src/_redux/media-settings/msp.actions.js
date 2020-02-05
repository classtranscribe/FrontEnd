import {
  SET_MEDIA,
  SET_TAB,
} from './msp.action.types'

export const setMedia = value => ({ type: SET_MEDIA, value })
export const setTab   = value => ({ type: SET_TAB, value })