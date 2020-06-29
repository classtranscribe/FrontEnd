import React from 'react';
import { CTFragment, CTFormHeading, CTInput } from 'layout';

function PlaylistName(props) {
  let { name, setName } = props;
  const handleOnchanged = ({ target: { value } }) => setName(value);

  return (
    <CTFragment>
      <CTFormHeading>PLAYLIST NAME</CTFormHeading>
      <CTInput
        required
        id="playlist-name"
        label="Playlist Name"
        placeholder="Playlist Name"
        value={name}
        onChange={handleOnchanged}
      />
    </CTFragment>
  );
}
export default PlaylistName;
