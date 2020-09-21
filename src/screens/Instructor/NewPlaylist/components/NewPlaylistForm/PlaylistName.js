import React from 'react';
import PropTypes from 'prop-types';
import { CTFragment, CTFormHeading, CTInput } from 'layout';

function PlaylistName(props) {
  let { error, enable, name, setName } = props;
  const handleOnchanged = ({ target: { value } }) => setName(value);
  const emptyPlaylistName = error.includes('playlistName') && enable;

  return (
    <CTFragment>
      <CTFormHeading>PLAYLIST NAME</CTFormHeading>
      <CTInput
        required
        id="playlist-name"
        error={emptyPlaylistName}
        label="Playlist Name"
        placeholder="Playlist Name"
        value={name}
        onChange={handleOnchanged}
        helpText={emptyPlaylistName ? 'Playlist Name is required.' : ''}
        autoFocus
      />
    </CTFragment>
  );
}
PlaylistName.propTypes = {
  name: PropTypes.string,
};
export default PlaylistName;
