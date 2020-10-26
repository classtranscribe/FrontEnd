import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import { epubState } from './EPubStateManager';
import { epubCtrl } from './EPubController';
import { epubData } from './EPubDataController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  state: epubState,
  ctrl: epubCtrl,
  data: epubData
};

export { epubStore, connectWithRedux } from 'redux/epub';