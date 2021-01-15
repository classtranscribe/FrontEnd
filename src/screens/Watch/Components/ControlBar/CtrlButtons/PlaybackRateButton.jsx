import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { menuControl, MENU_HIDE, MENU_PLAYBACKRATE } from '../../../Utils';
import { connect } from 'dva'
export function PlaybackRateButtonWithRedux({ menu = MENU_HIDE, playbackrate = 1.0 }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_PLAYBACKRATE) {
      menuControl.open(MENU_PLAYBACKRATE);
    } else {
      menuControl.close();
    }
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_PLAYBACKRATE}
      label={<>Playback Rates (SHIFT+↑/↓)</>}
      ariaLabel="Playback Rate"
      id={MENU_PLAYBACKRATE}
      ariaTags={{
        'aria-label': `Playback Rate Menu (current rate: ${playbackrate})`,
        // 'aria-keyshortcuts': 'SHIFT+R',
        'aria-controls': 'watch-playbackrate-menu',
        'aria-haspopup': 'true',
      }}
    >
      <span aria-hidden="true" className="watch-btn-playbackrate-content" tabIndex="-1">
        {`${playbackrate} x`}
      </span>
    </WatchCtrlButton>
  );
}

export const PlaybackRateButton = connect(({ watch: { menu, playbackrate }, loading }) => ({
  menu, playbackrate
}))(PlaybackRateButtonWithRedux);
