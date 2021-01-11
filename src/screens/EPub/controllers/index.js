import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import EPubNavigator from './EPubNavigator';
import EPubDownloadController from './EPubDownloadController';
import { epubState } from './EPubStateManager';
import { epubCtrl } from './EPubController';
import { epubData } from './EPubDataController';
import { shortcut } from './ShortcutController';
import { epubPref } from './PreferenceController';
import { connect } from 'dva'
export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  download: EPubDownloadController,
  state: epubState,
  ctrl: epubCtrl,
  data: epubData,
  history: epubData.history,
  nav: new EPubNavigator(),
  shortcut,
  pref: epubPref
};
// Transition Function
export const connectWithRedux = (Component) => {
  return connect(({ epub, loading }) => ({
    epub
  }))(Component);
}
export * from './utils';
export * from './onboard-guide';