import React, { useEffect, useState } from 'react';
import { useLocation } from 'dva/router';
import ErrorTypes from 'entities/ErrorTypes';
import { uurl, elem } from 'utils';
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
    if (plid) {
      setPlaylistId(plid);
      setup.setupPlaylist(plid);
    } else {
      setPlaylistId(null);
      setPlaylist(null);
    }
  }, [hash]);

  useEffect(() => {
    if (playlist === ErrorTypes.NotFound404) {
      setPlaylistId(null);
      setPlaylist(null);
    }
  }, [playlist]);

  useEffect(() => {
    if (!playlistId) {
      setup.scrollToPlaylist(setup.prevPlaylistId);
    } else if (window.innerWidth >= 1000) {
        elem.scrollToTop('cp-pls-view');
      } else {
        elem.scrollToTop('ct-layout-scroll');
      }
  }, [playlistId])

  const isPlaylistView = Boolean(playlistId);

  const playlistsProps = {
    isInstMode,
    playlists,
    offering,
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
