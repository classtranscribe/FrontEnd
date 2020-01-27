import React from 'react'
import { CTButton } from 'components'
import { setup, NEW_PLAYLIST } from '../../Utils'

function NoPlaylistHolder() {

  const createNewPlaylist = () => {
    setup.changePlaylist(NEW_PLAYLIST, 0)
  }

  return (
    <div className="ip-playlist-con ct-a-fade-in ip-create-new-con">
      <div className="ip-create-new-text">

      </div>
      <div className="ip-create-new-btn">
        <CTButton
          text="Create Your First Playlist"
          size="big bold"
          color="green"
          icon="add"
          onClick={createNewPlaylist}
        />
      </div>
    </div>
  )
}

export default NoPlaylistHolder