import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../ControlBar/CtrlButtons/WatchCtrlButton'
import { 
  MENU_HIDE, 
  MENU_PLAYLISTS,
  menuControl
} from '../../Utils'
import './index.css'

function PlaylistMenuTrigger({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    menuControl.open(MENU_PLAYLISTS, 'b')
  }

  return (
    <WatchCtrlButton
      id="playlist-menu-btn"
      classNames="playlist-menu-btn"
      position="top"
      onClick={handleMenuTrigger}
      active={menu === MENU_PLAYLISTS}
      label={'Playlists (SHIFT+P)'}
      ariaTags={{
        'aria-label': `Playlists Menu`,
        //'aria-keyshortcuts': 'Shift+P',
        'aria-controls': 'watch-playlists-menu',
        'aria-haspopup': 'true'
      }}
    >
      <span className="watch-btn-content watch-playlist-menu-tigger-content" tabIndex="-1">
        <i className="material-icons">list</i>
      </span>
    </WatchCtrlButton>
  )
}

export default connectWithRedux(
  PlaylistMenuTrigger,
  ['menu'],
  []
)