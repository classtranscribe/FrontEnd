import React, { useState, useEffect, useContext } from 'react';
import {
  CTFragment,
  CTFormHeading,
  CTFormRow,
  CTInput,
  CTSelect,
  CTCheckbox,
  CTForm,
} from 'layout';
import { api, util, user } from 'utils';
import PlaylistType from './PlaylistSelection';
import PlaylistName from './PlaylistName';
import PlaylistUrl from './PlaylistUrl';

export function NewPlaylistForm() {
  const [playlistName, setplaylistName] = useState('');
  const playlistNameProps = { playlistName, setplaylistName };
  const [sourceType, setsourceType] = useState('opt-1');
  const sourceTypeProps = { sourceType, setsourceType };
  const [url, setUrl] = useState(null);
  const playlistUrlProps = { sourceType, url, setUrl };
  return (
    <CTForm
      heading="Playlist"
      padding={[10, 35]}
      id="ctform-basics"
      details="Create a new Playlist"
    >
      <PlaylistName {...playlistNameProps} />
      <PlaylistType {...sourceTypeProps} />
      <PlaylistUrl {...playlistUrlProps} />
    </CTForm>
  );
}
