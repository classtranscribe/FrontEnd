import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { uurl, NOT_FOUND_404 } from 'utils';
import { connectWithRedux, setup } from '../../controllers';
import './index.scss';

import PlaylistsView from './PlaylistsView';
import VideosView from './VideosView';

function PlaylistsWithRedux({
  isInstMode,
  offering,
  playlist,
  playlists,
  setPlaylist
}) {
  const { hash } = useLocation();
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    let { plid } = uurl.useHash();
    setPlaylistId(plid);
    setup.setupPlaylist(plid);
  }, [hash]);

  useEffect(() => {
    if (playlist === NOT_FOUND_404) {
      setPlaylistId(null);
      setPlaylist(null);
    }
  }, [playlist]);

  const isPlaylistView = Boolean(playlistId);

  const playlistsProps = {
    isInstMode,
    playlists,
    offeringId: offering.id,
    accessType: offering.accessType,
  };

  const viewElement = (
    isPlaylistView
    ? <VideosView playlist={playlist} />
    : <PlaylistsView {...playlistsProps} />
  );

  return viewElement;
}

export const Playlists = connectWithRedux(
  PlaylistsWithRedux,
  [
    'playlists',
    'playlist',
    'offering',
    'isInstMode'
  ],
  ['setPlaylist']
);
