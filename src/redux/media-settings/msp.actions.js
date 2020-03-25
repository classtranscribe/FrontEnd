import {
  SET_MEDIA,
  SET_TAB,
  // ePub
  SET_EPUB_DATA,
  SET_IS_EDITING_EPUB,
} from './msp.action.types'

export const setMedia         = value => ({ type: SET_MEDIA, value })
export const setTab           = value => ({ type: SET_TAB, value })
export const setEpubData      = value => ({ type: SET_EPUB_DATA, value })
export const setIsEditingEpub = value => ({ type: SET_IS_EDITING_EPUB, value })