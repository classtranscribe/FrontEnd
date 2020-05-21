import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { connectWithRedux, videoControl } from '../../../Utils';

export function RewindButtonWithRedux() {
  const handleRewind = () => {
    videoControl.rewind(10);
  };

  return (
    <WatchCtrlButton
      onClick={handleRewind}
      label="Rewind 10 Seconds"
      id="rewind-screen-btn"
      ariaTags={{
        'aria-label': 'Rewind 10 seconds',
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">replay_10</i>
      </span>
    </WatchCtrlButton>
  );
}

export const RewindButton = connectWithRedux(RewindButtonWithRedux);
