import {
  SET_MEDIA,
  SET_PLAYLIST,
  SET_TAB,
  SET_ERROR,
} from './msp.action.types'
import { createAction } from '../redux-creators'

export const setMedia         = createAction(SET_MEDIA)
export const setPlaylist      = createAction(SET_PLAYLIST)
export const setTab           = createAction(SET_TAB)

export const setError         = createAction(SET_ERROR)