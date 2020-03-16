import React, { useEffect } from 'react'
import {
  connectWithRedux,
  menuControl,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_SETTING,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
  MENU_LANGUAGE,
  MENU_SHORTCUTS,
  // MENU_BEFORE_HIDE,
} from '../../Utils'
import PlaylistsMenu from './PlaylistsMenu'
import PlaybackrateMenu from './PlaybackrateMenu'
import ScreenModeMenu from './ScreenModeMenu'
import SettingMenu from './SettingMenu'
import LanguageMenu from './LanguageMenu'
import DownloadMenu from './DownloadMenu'
import ShortcutsTable from './ShortcutsTable'
import './index.css'

export function MenusWithRedux({
  menu,
  setMenu
}) {

  // Register setMenu to menuControl
  useEffect(() => {
    menuControl.register({ setMenu })
  }, [])
  const closeMenu = () => menuControl.close()

  // const hideBefore = menu === MENU_BEFORE_HIDE

  return (
    <div className={`watch-menus`} data-menu-type={menu}>
      <div className="watch-menu-blur" aria-hidden="true" ></div>
      {
        menu === MENU_PLAYLISTS
        &&
        <PlaylistsMenu onClose={closeMenu} />
      }
      {
        menu === MENU_PLAYBACKRATE 
        && 
        <PlaybackrateMenu onClose={closeMenu} />
      }
      {
        menu === MENU_SCREEN_MODE 
        && 
        <ScreenModeMenu onClose={closeMenu} />
      }
      {
        menu === MENU_SETTING
        &&
        <SettingMenu onClose={closeMenu} />
      }
      {
        menu === MENU_LANGUAGE
        &&
        <LanguageMenu onClose={closeMenu} />
      }
      {
        menu === MENU_DOWNLOAD
        &&
        <DownloadMenu onClose={closeMenu} />
      }
      {
        menu === MENU_SHORTCUTS
        &&
        <ShortcutsTable onClose={closeMenu} />
      }
    </div>
  )
}

export const Menus = connectWithRedux(
  MenusWithRedux,
  ['menu'],
  ['setMenu']
)

