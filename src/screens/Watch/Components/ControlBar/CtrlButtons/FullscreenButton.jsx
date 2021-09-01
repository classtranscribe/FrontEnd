import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux } from '../../../Utils';

export function FullscreenButtonWithRedux({ isFullscreenTwo = false, dispatch }) {
  const handleFullscreen = () => {
    dispatch({type: 'watch/toggleFullScreenTwo'})
  };

  return (
    <WatchCtrlButton
      onClick={handleFullscreen}
      label={isFullscreenTwo ? 'Exit Fullscreen (f)' : 'Enter Fullscreen (f)'}
      ariaTags={{
        'aria-label': isFullscreenTwo ? 'Exit Fullscreen' : 'Enter Fullscreen',
        // 'aria-keyshortcuts': 'f'
      }}
      id="fullscreen-btn"
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        {isFullscreenTwo ? (
          <i className="material-icons">fullscreen_exit</i>
        ) : (
          <i className="material-icons">fullscreen</i>
        )}
      </span>
    </WatchCtrlButton>
  );
}

export const FullscreenButton = connectWithRedux(FullscreenButtonWithRedux, ['isFullscreen']);
