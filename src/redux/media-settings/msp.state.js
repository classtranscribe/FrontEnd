import { api, ARRAY_INIT } from '../../utils';
import { DEFAULT_IS_MANAGING_CHAPTERS } from 'screens/MediaSettings/Utils/epub/constants';

export const initialState = {
  media: api.parseMedia(),
  playlist: {},
  
  tab: '',
  epubData: ARRAY_INIT,
  isManagingChapters: DEFAULT_IS_MANAGING_CHAPTERS,

  error: null
};