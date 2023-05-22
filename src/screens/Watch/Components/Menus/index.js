import React, { useEffect } from 'react';
import { connect } from 'dva'
import {
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_SETTING,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
  MENU_LANGUAGE,
  MENU_SHORTCUTS,
  MENU_GLOSSARY, // May 20 Jiaxi
  // MENU_BEFORE_HIDE,
} from '../../Utils';
import './index.scss';
import PlaylistsMenu from './PlaylistsMenu';
import PlaybackrateMenu from './PlaybackrateMenu';
import ScreenModeMenu from './ScreenModeMenu';
import SettingMenu from './SettingMenu';
import LanguageMenu from './LanguageMenu';
import DownloadMenu from './DownloadMenu';
import ShortcutsTable from './ShortcutsTable';
import CTPopup from '../CTPopup/CTPopup'; // May 20 Jiaxi

export function MenusWithRedux({ menu, transcriptions, dispatch }) {
  const closeMenu = () => dispatch({type: 'watch/menu_close'});
  // const hideBefore = menu === MENU_BEFORE_HIDE

  return (
    <div className="watch-menus" data-menu-type={menu}>
      <div className="watch-menu-blur" aria-hidden="true" />
      {menu === MENU_PLAYLISTS && <PlaylistsMenu onClose={closeMenu} />}
      {menu === MENU_PLAYBACKRATE && <PlaybackrateMenu onClose={closeMenu} />}
      {menu === MENU_SCREEN_MODE && <ScreenModeMenu onClose={closeMenu} />}
      {menu === MENU_SETTING && <SettingMenu onClose={closeMenu} />}
      {menu === MENU_LANGUAGE && <LanguageMenu onClose={closeMenu} />}
      {menu === MENU_DOWNLOAD && <DownloadMenu onClose={closeMenu} trans={transcriptions} />}
      {menu === MENU_SHORTCUTS && <ShortcutsTable onClose={closeMenu} />}
      {menu === MENU_GLOSSARY && <CTPopup onClose={closeMenu} />} {/* May 20 Jiaxi */}
    </div>
  );
}

export const Menus = connect(({ watch: { menu, transcriptions }, loading }) => ({
  menu, transcriptions
}))(MenusWithRedux);
