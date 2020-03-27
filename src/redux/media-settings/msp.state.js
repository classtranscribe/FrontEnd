import { api, ARRAY_INIT } from '../../utils'

export const initialState = {
  media: api.parseMedia(),
  tab: '',
  epubData: ARRAY_INIT,
  isEditingEpub: false,

  error: null
}