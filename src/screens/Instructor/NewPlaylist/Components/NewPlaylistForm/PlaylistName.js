import React, { useState, useEffect, useContext } from 'react';
import { CTFragment, CTFormHeading, CTFormRow, CTInput, CTSelect, CTCheckbox } from 'layout';
import { api, util, user } from 'utils';

function PlaylistName(props) {
  let { playlistName, setplaylistName } = props;
  const handleOnchanged = ({ target: { value } }) => setplaylistName(value);
  return (
    <CTFragment>
      <CTFormHeading>PLAYLIST NAME</CTFormHeading>
      <CTInput
        required
        id="playlist-name"
        label="Playlist Name"
        placeholder="Playlist Name"
        value={playlistName}
        onChange={handleOnchanged}
      />
    </CTFragment>
  );
}
export default PlaylistName;
