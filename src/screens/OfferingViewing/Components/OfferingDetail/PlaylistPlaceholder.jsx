import React from 'react'
import { Loader, Button } from 'semantic-ui-react'
import { user } from '../../../../utils'

export default function PlaylistPlaceholder({ noPlaylist, signIn }) {
  return (
    <div className="playlist-container pl-loader">
      {
        (!noPlaylist && !signIn) 
        && 
        <Loader active inline='centered' />
      }
      {
        noPlaylist 
        && 
        <div className="w-100 d-flex justify-content-center align-items-center text-muted">
          NO PLAYLIST
        </div>
      }
      {
        signIn 
        && 
        <div className="w-100 d-flex flex-column justify-content-center align-items-center">
          <p className="text-muted">Please Sign In to Watch the Videos</p>
          <Button secondary compact onClick={() => user.signin()}>Sign In</Button>
        </div>
      }
    </div>
  )
}