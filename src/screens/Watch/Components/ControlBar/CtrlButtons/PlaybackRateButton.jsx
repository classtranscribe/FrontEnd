import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { MENU_HIDE, MENU_PLAYBACKRATE } from '../../../Utils';
import { connect } from 'dva'
export function PlaybackRateButtonWithRedux({ menu = MENU_HIDE, playbackrate = 1.0, dispatch }) {
  const handleMenuTrigger = () => {
    if (menu !== MENU_PLAYBACKRATE) {
      dispatch({type: 'watch/menu_open', payload: { type: MENU_PLAYBACKRATE } });
    } else {
      dispatch({type: 'watch/menu_close'});
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

export const PlaybackRateButton = connect(({ watch: { menu }, playerpref: { playbackrate }, loading }) => ({
  menu, playbackrate
}))(PlaybackRateButtonWithRedux);
