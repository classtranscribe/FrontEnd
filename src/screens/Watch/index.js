/**
 * Watch screen for ClassTranscribe
 */

import React from 'react';
import { isMobile } from 'react-device-detect';
import { withReduxProvider } from 'redux/redux-provider';
import { uurl } from 'utils/use-url';
import { CTLayout } from 'layout';
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
  WatchHeaderLeftElem,
  WatchHeaderRightElem,
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
    const { id } = uurl.useSearch();
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

  getLayoutProps({ isFullscreen, error }) {
    return CTLayout.createProps({
      transition: true,
      darkMode: true,
      fill: true,
      logoBrand: isMobile,
      headerProps: {
        show: !isFullscreen,
        leftElem: <WatchHeaderLeftElem />,
        rightElem: <WatchHeaderRightElem plain={error} />
      },
      sidebarProps: {
        float: true
      }
    });
  }

  render() {
    const { error } = this.state;
    const { isFullscreen } = this.props;
    const layoutProps = this.getLayoutProps({ isFullscreen, error });

    return (
      <CTLayout {...layoutProps}>
        <div className="watch-bg" id="watch-page">
          {
            error ? (
              <ErrorWrapper error={error} />
            ) : (
              <>
                <TabEventHelperButtons />
                <Modals />
                {/* <WatchHeader /> */}
                <Search />
                <Menus />
                <ClassTranscribePlayer />
                <UpNext />
                <TransCtrlButtons />
                <Transcriptions />
                <ControlBar />
              </>
            )
          }
        </div>
      </CTLayout>
    );
  }
}

export const Watch = withReduxProvider(
  WatchWithRedux,
  watchStore,
  connectWithRedux,
  ['media', 'playlist', 'isFullscreen'], 
  ['all']
);