import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux, videoControl } from '../../../Utils';

export function FullscreenButtonWithRedux({ isFullscreen = false, dispatch }) {
  const handleFullscreen = () => {
    dispatch({type: 'watch/toggleFullScreen'})
  };

  return (
    <WatchCtrlButton
      onClick={handleFullscreen}
      label={isFullscreen ? 'Exit Fullscreen (f)' : 'Enter Fullscreen (f)'}
      ariaTags={{
        'aria-label': isFullscreen ? 'Enter Fullscreen' : 'Enter Fullscreen',
        // 'aria-keyshortcuts': 'f'
      }}
      id="fullscreen-btn"
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        {isFullscreen ? (
          <i className="material-icons">fullscreen_exit</i>
        ) : (
          <i className="material-icons">fullscreen</i>
        )}
      </span>
    </WatchCtrlButton>
  );
}

export const FullscreenButton = connectWithRedux(FullscreenButtonWithRedux, ['isFullscreen']);
