import { connect } from 'dva'

export * from './constants.util';
export * from './data';
export * from './helpers';

export { generateWatchUserGuide } from './user-guide';
export { setup } from './setup.control';
export { videoControl } from './player.control';
export { menuControl } from './menu.control';
export { modalControl } from './modal.control';
export { keydownControl } from './keydown.control';
export { transControl } from './trans.control';
export { promptControl } from './prompt.control';
export { searchControl } from './search.control';
export { preferControl } from './preference.control';
export { downloadControl } from './download.control';
export { uEvent } from './UserEventController';
export const connectWithRedux = (Component) => {
    return connect(({ watch, loading, history }) => ({
        ...watch
      }))(Component);
}