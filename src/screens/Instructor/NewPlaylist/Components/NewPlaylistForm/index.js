import React, { useState } from 'react';
import { CTForm } from 'layout';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm(props) {
  const { onSave } = props;

  const [name, setName] = useState('');
  const [sourceType, setsourceType] = useState(2);
  const [url, setUrl] = useState('');
  const [errors, setErrors] = useState([]);

  const playlistNameProps = { name, setName };
  const sourceTypeProps = { sourceType, setsourceType };
  const playlistUrlProps = { sourceType, url, setUrl };

  const handleSave = async () => {
    if (typeof onSave === 'function') {
      onSave({ name, sourceType, url });
    }
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
