import React from 'react';
import { MENU_HIDE, MENU_PLAYLISTS } from '../../../Utils';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';

function PlaylistMenuTrigger({ menu = MENU_HIDE, dispatch }) {
  const handleMenuTrigger = () => {
    dispatch({type: 'watch/menu_open', payload: { type: MENU_PLAYLISTS, option: 'b'}});
  };

  return (
    <WatchCtrlButton
      id="playlist-menu-btn"
      classNames="playlist-menu-btn"
      position="top"
      onClick={handleMenuTrigger}
      active={menu === MENU_PLAYLISTS}
      label="Playlists (SHIFT+P)"
      ariaTags={{
        'aria-label': `Playlists Menu`,
        // 'aria-keyshortcuts': 'Shift+P',
        'aria-controls': 'watch-playlists-menu',
        'aria-expanded': menu === MENU_PLAYLISTS ? 'false' : 'true',
      }}
    >
      <span className="watch-btn-content watch-playlist-menu-tigger-content" tabIndex="-1">
        <i className="material-icons">list</i>
      </span>
    </WatchCtrlButton>
  );
}

export default connect(({ watch: { menu }, loading }) => ({
  menu
}))(PlaylistMenuTrigger);
