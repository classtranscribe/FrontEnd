import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
  MENU_HIDE, MENU_PLAYBACKRATE, 
  menuControl
} from '../../../Utils'

export function PlaybackRateButtonWithRedux({
  menu=MENU_HIDE,
  playbackrate=1.0
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_PLAYBACKRATE) {
      menuControl.open(MENU_PLAYBACKRATE)
    } else {
      menuControl.close()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_PLAYBACKRATE}
      label={<>Playback Rates (SHIFT+↑/↓)</>}
      ariaLabel="Playback Rate"
      id={MENU_PLAYBACKRATE}
    >
      <span className="watch-btn-playbackrate-content" tabIndex="-1">
        {`${playbackrate} x`}        
      </span>
    </WatchCtrlButton>
  )
}

export const PlaybackRateButton = connectWithRedux(
  PlaybackRateButtonWithRedux,
  ['menu', 'playbackrate'],
  []
)