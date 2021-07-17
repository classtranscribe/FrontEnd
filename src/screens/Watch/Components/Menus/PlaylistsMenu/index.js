import React, { useState, useEffect } from 'react';
import { isMobile } from 'react-device-detect';
import { connectWithRedux } from '../../../Utils';
import './index.scss';

import PlaylistView from './PlaylistView';
import Videos from './Videos';

function PlaylistsMenu({ onClose = null, media = {}, playlist = {} }) {
  const currMedia = media;
  const currMediaId = currMedia.id;

  const [currPlaylist, setCurrPlaylist] = useState({});

  useEffect(() => {
    setCurrPlaylist(playlist);
  }, [playlist]);

  return (
    <div id="watch-playlists-menu" className="watch-playlists-menu">
      {/* Close Btn */}
      <button
        className="plain-btn watch-menu-close-btn watch-playlists-menu-close-btn"
        onClick={onClose}
      >
        <i className="material-icons">close</i>
      </button>

      {!isMobile && <PlaylistView currPlaylist={currPlaylist} setCurrPlaylist={setCurrPlaylist} />}

      {/* Videos view */}
      <Videos currMediaId={currMediaId} currPlaylist={currPlaylist} />
    </div>
  );
}

export default connectWithRedux(PlaylistsMenu, ['media', 'playlist']);
