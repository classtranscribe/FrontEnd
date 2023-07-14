import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux } from '../../../Utils';

export function SwitchScreenButtonWithRedux({dispatch}) {
  const handleSwitch = () => {
    dispatch({ type: 'watch/switchVideo' });
  };

  return (
    <WatchCtrlButton
      onClick={handleSwitch}
      label="Routes Screens (SHIFT+<)"
      id="switch-screen-btn"
      ariaTags={{
        'aria-label': 'Routes Screens',
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
