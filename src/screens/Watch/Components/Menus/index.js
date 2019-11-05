import React from 'react'
import { connectWithRedux } from '_redux/watch'
import PlaylistsMenu from './PlaylistsMenu'
import PlaybackrateMenu from './PlaybackrateMenu'
import {
  MENU_HIDE,
  MENU_BEFORE_HIDE,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_CAPTIONS,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
} from '../../Utils'
import './index.css'

const type = MENU_PLAYLISTS

export function MenusWithRedux({
  menu,
  setMenu
}) {

  const closeMenu = () => {
    setMenu(MENU_BEFORE_HIDE)
    setTimeout(() => {
      setMenu(MENU_HIDE)
    }, 200);
  }

  return (
    <div className={`watch-menus`} type={menu}>
      <PlaylistsMenu 
        show={menu === MENU_PLAYLISTS}  
        onClose={closeMenu}
      />
      <PlaybackrateMenu
        show={menu === MENU_PLAYBACKRATE}  
        onClose={closeMenu}
      />
    </div>
  )
}

export const Menus = connectWithRedux(
  MenusWithRedux,
  ['menu'],
  ['setMenu']
)

