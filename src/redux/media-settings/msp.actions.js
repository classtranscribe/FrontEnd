import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_TAB,
  // ePub
  SET_EPUB_DATA,
  SET_IS_EDITING_EPUB,
  SET_ERROR,
} from './msp.action.types'
import { createAction } from '../redux-creators'

export const setMedia         = createAction(SET_MEDIA)
export const setPlaylist      = createAction(SET_PLAYLIST)
export const setTab           = createAction(SET_TAB)

export const setEpubData      = createAction(SET_EPUB_DATA)
export const setIsEditingEpub = createAction(SET_IS_EDITING_EPUB)

export const setError         = createAction(SET_ERROR)