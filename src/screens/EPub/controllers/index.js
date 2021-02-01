import { connect } from 'dva'
import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import EPubNavigator from './EPubNavigator';
import EPubDownloadController from './EPubDownloadController';
import { epubState } from './EPubStateManager';
import { epubData } from './EPubDataController';
import { shortcut } from './ShortcutController';
import { epubPref } from './PreferenceController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  download: EPubDownloadController,
  state: epubState,
  data: epubData,
  history: epubData.history,
  nav: new EPubNavigator(),
  shortcut,
  pref: epubPref
};
// Transition Function
export const connectWithRedux = (Component, property) => {
  return connect(({ epub : _epub, loading, history }) => {
    if (!property) {
      return {};
    }
    const props = {};
    property.map((key) => {
      props[key] = _epub[key];
      return false;
    })
    return props;
  })(Component);
}
export * from './utils';
export * from './onboard-guide';