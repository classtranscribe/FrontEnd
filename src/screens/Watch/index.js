/**
 * Watch screen for ClassTranscribe
 */

import React, { useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { uurl } from 'utils/use-url';
import { CTLayout } from 'layout';
import { connect } from 'dva'
import {
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

/*
showHWatchUserGuide = () => {
    const watchUserGuide = generateWatchUserGuide();
    watchUserGuide.start();
  };
*/

const WatchWithRedux = (props) => {
  const { isFullscreen, menu, dispatch } = props;
  let { error } = props;
  const { id } = uurl.useSearch();
  useEffect(() => {
    /** GET media, playlist  */
    // setup.setupMedias();
    /** Add keydown event handler */
    keydownControl.addKeyDownListener(dispatch);
    // update WatchModel
    /** Add resize event listener */
  }, [])
  useEffect(() => {
    keydownControl.setMenuModel(menu)
  }, [menu])
  if (!id) error = ERR_INVALID_MEDIA_ID;
  const layoutProps = CTLayout.createProps({
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
  return (
    <CTLayout {...layoutProps}>
      <div className="watch-bg" id="watch-page">
        {
          error ? (
            <ErrorWrapper error={error} />
          ) : (
            <><TabEventHelperButtons dispatch={dispatch} />
              <Modals />
              {/* <WatchHeader /> */}
              <Search />
              <Menus />
              <ClassTranscribePlayer />
              <UpNext />
              <TransCtrlButtons />
              <Transcriptions />
              <ControlBar />
            </>)
        }
      </div>
    </CTLayout>
  );
}

export const Watch = connect(({ loading, watch: { menu, error, isFullscreen } }) => ({
  menu, error, isFullscreen
}))(WatchWithRedux);