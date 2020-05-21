import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux, videoControl } from '../../../Utils';

export function SwitchScreenButtonWithRedux() {
  const handleSwitch = () => {
    videoControl.switchVideo();
  };

  return (
    <WatchCtrlButton
      onClick={handleSwitch}
      label="Switch Screens (SHIFT+<)"
      id="switch-screen-btn"
      ariaTags={{
        'aria-label': 'Switch Screens',
        // 'aria-keyshortcuts': 'SHIFT+,'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">compare_arrows</i>
      </span>
    </WatchCtrlButton>
  );
}

export const SwitchScreenButton = connectWithRedux(SwitchScreenButtonWithRedux);
