import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import { epubState } from './EPubStateManager';
import { epubCtrl } from './EPubController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  state: epubState,
  ctrl: epubCtrl
};

export { epubStore, connectWithRedux } from 'redux/epub';