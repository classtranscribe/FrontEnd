import { api, ARRAY_INIT } from '../../utils'

export const initialState = {
  media: api.parseMedia(),
  playlist: {},
  
  tab: '',
  epubData: ARRAY_INIT,
  isEditingEpub: false,

  error: null
}