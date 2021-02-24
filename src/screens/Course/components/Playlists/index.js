import React, { useEffect, useState } from 'react';
import ErrorTypes from 'entities/ErrorTypes';
import { uurl, elem } from 'utils';
import './index.scss';
import courseutil from '../../util'
import PlaylistsView from './PlaylistsView';
import VideosView from './VideosView';

function PlaylistsWithRedux(props) {
  const { course, dispatch } = props;
  const {
    isInstMode,
    offering = {},
    playlist,
    playlists = [],
    setPlaylist
  } = course
  const setup = {}; // TO DISPATCH
  const { hash } = props.location || {};
  const [playlistId, setPlaylistId] = useState(null);

  useEffect(() => {
    let { plid } = uurl.useHash();
    if (plid) {
      setPlaylistId(plid);
      dispatch({
        type: 'course/getPlaylistById', 
        payload: plid
      })
    } else {
      setPlaylistId(null);
      dispatch({
        type: 'course/setPlaylist', 
        payload: null
      })
    }
  }, [hash]); 

  useEffect(() => {
    if (playlist === ErrorTypes.NotFound404) {
      setPlaylistId(null);
      dispatch({
        type: 'course/setPlaylist', 
        payload: null
      })
    }
  }, [playlist]);

  useEffect(() => {
    if (!playlistId) {
      courseutil.scrollToPlaylist(setup.prevPlaylistId);
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
    dispatch
  };
  
  const viewElement = (
    isPlaylistView
    ? <VideosView playlist={playlist} />
    : <PlaylistsView {...playlistsProps} />
  );

  return viewElement;
}

export const Playlists = PlaylistsWithRedux;
