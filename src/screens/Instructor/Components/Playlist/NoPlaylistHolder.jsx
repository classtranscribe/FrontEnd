import React from 'react'
import { CTButton } from 'components'
import { connectWithRedux } from '_redux/instructor'

function NoPlaylistHolder({

}) {
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
        />
      </div>
    </div>
  )
}

export default connectWithRedux(
  NoPlaylistHolder,
  [],
  []
)