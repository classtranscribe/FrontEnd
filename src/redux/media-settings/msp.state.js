import { api, ARRAY_INIT } from '../../utils'
import { DEFAULT_IS_EDITING_EPUB } from 'screens/MediaSettings/Utils/constants'

export const initialState = {
  media: api.parseMedia(),
  playlist: {},
  
  tab: '',
  epubData: ARRAY_INIT,
  isEditingEpub: DEFAULT_IS_EDITING_EPUB,

  error: null
}