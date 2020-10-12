import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Playlist } from 'entities/Playlists';
import { InfoAndListLayout } from 'components';
import { connectWithRedux, plControl } from '../../controllers';

import BreadCrumb from './BreadCrumb';
import PlaylistName from './PlaylistName';
import Actions from './Actions';
import './index.scss';

function PlaylistInfoWithRedux({
  offering,
  playlist
}) {
  const history = useHistory();

  const [editing, setEditing] = useState(false);
  const [inputValue, setInputValue] = useState(playlist.name);

  const handleEdit = () => setEditing(true);

  const onInputChange = ({ target: { value } }) => {
    setInputValue(value);
  };

  const handleCancelRename = () => setEditing(false);

  const handleRename = () => {
    if (!inputValue) return;
    plControl.renamePlaylist(inputValue);
    handleCancelRename();
  };

  const handleDelete = () => {
    plControl.confirmDeletePlaylist(history);
  };

  const sourseURL = plControl.getPlaylistSourceURL(playlist);
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

export const PlaylistInfo = connectWithRedux(
  PlaylistInfoWithRedux,
  ['playlist', 'offering']
);



