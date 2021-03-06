import { connect } from 'dva'
import EPubConstants from './constants/EPubConstants';
import EPubIDs from './constants/EPubIDs';
import EPubDownloadController from './EPubDownloadController';
import { epubPref } from './PreferenceController';

export const epub = {
  const: EPubConstants,
  id: EPubIDs,
  download: EPubDownloadController,
  history: {},  // epubData.history, NOT IMPLEMENTED
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