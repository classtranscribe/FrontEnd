import React, { useEffect, useState } from 'react';
import { connect } from 'dva'
import {
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_SETTING,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
  MENU_LANGUAGE,
  MENU_TRANSCRIPTION,
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
import TranscriptionMenu from './TranscriptionMenu';
import DownloadMenu from './DownloadMenu';
import ShortcutsTable from './ShortcutsTable';
import CTPopup from '../CTPopup/CTPopup'; // May 20 Jiaxi

export function MenusWithRedux({ menu, transcriptions, dispatch }) {
  const closeMenu = () => dispatch({type: 'watch/menu_close'});
  // const hideBefore = menu === MENU_BEFORE_HIDE

  // CSS class watch-menus creates a semi-transparent "curtain" that 
  // masks off the components, or the video player from the user. 
  // This makes the menu fullscreen.
  // Therefore, some components should not be rendered through it.
  const [shouldFullscreen, setShouldFullscreen] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState();
  
  useEffect(() =>{
    switch (menu) {
      case MENU_PLAYLISTS:
        setSelectedMenu(<PlaylistsMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_PLAYBACKRATE:
        setSelectedMenu(<PlaybackrateMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_SCREEN_MODE:
        setSelectedMenu(<ScreenModeMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_SETTING:
        setSelectedMenu(<SettingMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_LANGUAGE: // Marked for removal; replaced by MENU_TRANSCRIPTION
        setSelectedMenu(<LanguageMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_TRANSCRIPTION:
        setSelectedMenu(<TranscriptionMenu onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_DOWNLOAD:
        setSelectedMenu(<DownloadMenu onClose={closeMenu} trans={transcriptions} />);
        setShouldFullscreen(true);
      break;
      case MENU_SHORTCUTS:
        setSelectedMenu(<ShortcutsTable onClose={closeMenu} />);
        setShouldFullscreen(true);
      break;
      case MENU_GLOSSARY:
        setSelectedMenu(<CTPopup onClose={closeMenu} /> );
        setShouldFullscreen(false);
        /* May 20 Jiaxi */
      break;
      default:
        setSelectedMenu(null);
        setShouldFullscreen(false);
    }
  }, [menu]);
  
  // Select the JSX component to be rendered.


  if (shouldFullscreen) {
    return (
      <div className="watch-menus" data-menu-type={menu}>
        <div className="watch-menu-blur" aria-hidden="true" />
        {selectedMenu}
      </div>
    ); 
  }
  return selectedMenu;
}

export const Menus = connect(({ watch: { menu, transcriptions } }) => ({
  menu, transcriptions
}))(MenusWithRedux);
