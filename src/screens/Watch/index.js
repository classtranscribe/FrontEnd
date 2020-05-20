/**
 * Watch screen for ClassTranscribe
 */

import React from 'react';
import { Provider } from 'react-redux';
import { util } from 'utils';
import {
  watchStore,
  connectWithRedux,
  generateWatchUserGuide,
  setup,
  videoControl,
  transControl,
  searchControl,
  preferControl,
  keydownControl,
  ERR_INVALID_MEDIA_ID,
} from './Utils';
import './index.css';
import './zIndex.css';

import {
  ErrorWrapper,
  WatchHeader,
  Menus,
  Modals,
  ClassTranscribePlayer,
  Search,
  ControlBar,
  Transcriptions,
  TabEventHelperButtons,
  UpNext,
  TransCtrlButtons,
} from './Components';

export class WatchWithRedux extends React.Component {
  constructor(props) {
    super(props);

    let error = null;
    const { id } = util.links.useSearch();
    this.id = id;
    if (!id) error = ERR_INVALID_MEDIA_ID;

    this.state = { error };
    const setError = (err) => this.setState({ error: err });

    /** Init controls */
    setup.init(props, setError);
    transControl.init(props);
    searchControl.init(props);
    preferControl.init(props);
  }

  componentDidMount() {
    /** GET media, playlist  */
    setup.setupMedias();
    /** Add keydown event handler */
    keydownControl.addKeyDownListener();
    /** Add resize event listener */
    videoControl.addWindowEventListener();
  }

  componentWillUnmount() {
    this.props.resetStates();
  }

  showHWatchUserGuide = () => {
    const watchUserGuide = generateWatchUserGuide();
    watchUserGuide.start();
  };

  render() {
    const { error } = this.state;

    return (
      <main className="watch-bg" id="watch-page">
        {error ? (
          <>
            <WatchHeader plain />
            <ErrorWrapper error={error} />
          </>
        ) : (
          <>
            <TabEventHelperButtons />
            <Modals />
            <WatchHeader />
            <Search />
            <Menus />
            <ClassTranscribePlayer />
            <UpNext />
            <TransCtrlButtons />
            <Transcriptions />
            <ControlBar />
          </>
        )}
      </main>
    );
  }
}

export function Watch(props) {
  const WatchConnectToRedux = connectWithRedux(WatchWithRedux, ['media', 'playlist'], ['all']);

  return (
    <Provider store={watchStore}>
      <WatchConnectToRedux {...props} />
    </Provider>
  );
}
