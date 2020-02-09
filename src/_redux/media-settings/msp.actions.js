import {
  SET_MEDIA,
  SET_TAB,
  // ePub
  SET_EPUB_DATA,
} from './msp.action.types'

export const setMedia     = value => ({ type: SET_MEDIA, value })
export const setTab       = value => ({ type: SET_TAB, value })
export const setEpubData  = value => ({ type: SET_EPUB_DATA, value })