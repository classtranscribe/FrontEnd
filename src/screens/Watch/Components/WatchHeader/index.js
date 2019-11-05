import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { ClassTranscribeHeader } from 'components'
import { 
  MENU_HIDE, 
  MENU_BEFORE_HIDE, 
  MENU_PLAYLISTS,
  menuControl
} from '../../Utils'
import './index.css'

export function WatchHeaderWithRedux({
  media={},
  playlist={},

  menu=MENU_HIDE,
  setMenu=null,
}) {

  const handleMenuTrigger = () => {
    if (menu != MENU_PLAYLISTS) setMenu(MENU_PLAYLISTS)
    else menuControl.closeMenu(setMenu)
  }

  return (
    <ClassTranscribeHeader darkMode>
      <button 
        className="plain-btn watch-playlists-menu-trigger" 
        onClick={handleMenuTrigger}
        aria-label="Playlists Menu"
      >
        {
          menu === MENU_PLAYLISTS ? 
          <i className="material-icons">close</i>
          :
          <i className="material-icons">list</i>
        }
      </button>
    </ClassTranscribeHeader>
  )
}

export const WatchHeader = connectWithRedux(
  WatchHeaderWithRedux,
  ['media', 'playlist', 'menu'],
  ['setMenu']
)