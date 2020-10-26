import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import EPubNavigator from './EPubNavigator';
import { epubState } from './EPubStateManager';
import { epubCtrl } from './EPubController';
import { epubData } from './EPubDataController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  state: epubState,
  ctrl: epubCtrl,
  data: epubData,
  history: epubData.history,
  nav: new EPubNavigator(),
};

export * from './utils';
export { epubStore, connectWithRedux } from 'redux/epub';