import React, { useState } from 'react';
import { uurl, links } from 'utils';
import { Playlist } from 'entities/Playlists';
import { InfoAndListLayout } from 'components';
import BreadCrumb from './BreadCrumb';
import PlaylistName from './PlaylistName';
import Actions from './Actions';
import './index.scss';

const YOUTUBE_PREFIX = 'https://www.youtube.com/playlist';
function getPlaylistSourceURL({ sourceType, playlistIdentifier, jsonMetadata }) {
  let source = '';
  if (!playlistIdentifier) return source;
  if (jsonMetadata && jsonMetadata.source) {
    return jsonMetadata.source;
  }

  if (sourceType === 1) {
    // YouTube
    source = YOUTUBE_PREFIX + uurl.createSearch({ list: playlistIdentifier });
  } else if (sourceType === 3) {
    // Kaltura
    source = `(Kaltura Playlist ID) ${playlistIdentifier}`;
  } else if (sourceType === 4) {
    // Box
    source = `(Box Folder ID) ${playlistIdentifier}`;
  } else if (sourceType === 0) {
    // echo
    source = playlistIdentifier; // ECHO360_PREFIX + playlistIdentifier + '/public'
  }

  return source;
}
function PlaylistInfoWithRedux(props) {
  const { history, instplaylist, dispatch } = props;
  const {
    offering,
    playlist
  } = instplaylist;

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(playlist.name);

  const handleEdit = () => setEditing(true);

  const onInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleCancelRename = () => setEditing(false);

  const handleRename = async () => {
    if (!inputValue) return;
    const playlist_ = await Playlist.rename(playlist, inputValue);
    if (playlist_) {
      dispatch({type: 'instplaylist/setPlaylist', payload: playlist_.toObject()});
    }
    handleCancelRename();
  };

  const handleDelete = () => {
    const confirm = {
      text: 'Are you sure you want to delete this playlist? This action cannot be undone!',
      onConfirm: async () => {
        const playlistId = playlist.id;
        const successed = await Playlist.delete(playlistId);
        if (successed) {
          history.push(links.course(offering.id));
        }
      }
    };
    dispatch({type: 'instplaylist/setConfirmation', payload: confirm});
  };

  const sourseURL = getPlaylistSourceURL(playlist);
  const plNameprops = {
    editing,
    sourseURL,
    inputValue,
    onInputChange,
    handleRename,
    ...playlist,
  };

  const actionProps = {
    editing,
    handleEdit,
    handleRename,
    handleCancelRename,
    handleDelete,
    playlistId: playlist.id,
    offeringId: offering.id
  };

  return (
    <InfoAndListLayout.Info id="ipl-pl-info">
      <BreadCrumb offering={offering} playlist={playlist} />

      <PlaylistName {...plNameprops} />

      <Actions {...actionProps} />
    </InfoAndListLayout.Info>
  );
}

export const PlaylistInfo = PlaylistInfoWithRedux;


