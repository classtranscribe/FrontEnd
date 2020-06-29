import React, { useState, useEffect, useContext } from 'react';
import { CTForm } from 'layout';
import { api, util, user } from 'utils';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm(props) {
  const { onSave } = props;

  const [playlistName, setplaylistName] = useState('');
  const [sourceType, setsourceType] = useState('opt-1');
  const [url, setUrl] = useState('');

  const playlistNameProps = { playlistName, setplaylistName };
  const sourceTypeProps = { sourceType, setsourceType };
  const playlistUrlProps = { sourceType, url, setUrl };

  const handleSave = async () => {
    onSave({
      playlistName,
      sourceType,
      url,
    });
  };

  return (
    <CTForm
      heading="Playlist"
      padding={[10, 35]}
      id="ctform-basics"
      onSave={handleSave}
      onSaveButtonText="Create New Playlist"
      details="Create a new Playlist"
    >
      <PlaylistName {...playlistNameProps} />
      <PlaylistType {...sourceTypeProps} />
      <PlaylistUrl {...playlistUrlProps} />
    </CTForm>
  );
}
