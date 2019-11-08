import React from 'react'
import { connectWithRedux } from '_redux/watch'
import {
  MENU_HIDE,
  MENU_BEFORE_HIDE,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_CAPTIONS,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
  menuControl,
  MENU_LANGUAGE
} from '../../Utils'
import PlaylistsMenu from './PlaylistsMenu'
import PlaybackrateMenu from './PlaybackrateMenu'
import ScreenModeMenu from './ScreenModeMenu'
import CCSettingMenu from './CCSettingMenu'
import LanguageMenu from './LanguageMenu'
import DownloadMenu from './DownloadMenu'
import './index.css'

export function MenusWithRedux({
  menu,
  setMenu
}) {

  // Register setMenu to menuControl
  menuControl.register({ setMenu })
  const closeMenu = () => menuControl.close()

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
      <ScreenModeMenu 
        show={menu === MENU_SCREEN_MODE}
        onClose={closeMenu}
      />
      <CCSettingMenu 
        show={menu === MENU_CAPTIONS}
        onClose={closeMenu}
      />
      <LanguageMenu
        show={menu === MENU_LANGUAGE}
        onClose={closeMenu}
      />
      <DownloadMenu
        show={menu === MENU_DOWNLOAD}
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

