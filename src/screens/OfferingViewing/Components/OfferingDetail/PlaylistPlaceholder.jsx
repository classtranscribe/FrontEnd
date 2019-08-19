import React from 'react'
import { Loader } from 'semantic-ui-react'

export default function PlaylistPlaceholder({ noPlaylist }) {
  return (
    <div className="pl-loader">
      {!noPlaylist && <Loader active inline='centered' />}
      {noPlaylist && <div className="w-100 d-flex justify-content-center align-items-center text-muted">NO PLAYLIST</div>}
    </div>
  )
}