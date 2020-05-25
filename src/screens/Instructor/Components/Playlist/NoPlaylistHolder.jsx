import React from 'react';
import { Button } from 'pico-ui';
import { setup, NEW_PLAYLIST } from '../../Utils';

function NoPlaylistHolder() {
  const createNewPlaylist = () => {
    setup.changePlaylist(NEW_PLAYLIST, 0);
  };

  return (
    <div className="ip-playlist-con ct-a-fade-in ip-create-new-con">
      <div className="ip-create-new-text" />
      <div className="ip-create-new-btn">
        <Button
          uppercase
          text="Create Your First Playlist"
          color="teal"
          icon="add"
          onClick={createNewPlaylist}
        />
      </div>
    </div>
  );
}

export default NoPlaylistHolder;
