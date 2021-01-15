import { connect } from 'dva'
import _ from 'lodash'
export * from './constants.util';
export * from './data';
export * from './helpers';

export { generateWatchUserGuide } from './user-guide';
export { setup } from './setup.control';
export { videoControl } from './player.control';
export { keydownControl } from './keydown.control';
export { transControl } from './trans.control';
export { promptControl } from './prompt.control';
export { searchControl } from './search.control';
export { preferControl } from './preference.control';
export { downloadControl } from './download.control';
export { uEvent } from './UserEventController';
export function findTransByLanguage (language, trans) {
  return _.find(trans, { language });
}
export const connectWithRedux = (Component, property) => {
  return connect(({ watch, loading, history }) => {
    if(!property) {
      return {};
    }
    const props = {};
    property.map((key) => {
      props[key] = watch[key];
    })
    return props;
  })(Component);
}