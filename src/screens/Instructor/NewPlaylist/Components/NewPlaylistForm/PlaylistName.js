import React, { useState, useEffect, useContext } from 'react';
import { CTFragment, CTFormHeading, CTFormRow, CTInput, CTSelect, CTCheckbox } from 'layout';
import { api, util, user } from 'utils';

function PlaylistName() {
  const [playlistName, setPlaylistName] = useState('');
  const handlePlaylistNameChange = ({ target: { value } }) => setPlaylistName(value);
  return (
    <CTFragment>
      <CTFormHeading>PLAYLIST NAME</CTFormHeading>
      <CTInput
        required
        id="playlist-name"
        label="Playlist Name"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={handlePlaylistNameChange}
      />
    </CTFragment>
  );
}
export default PlaylistName;
