import React from 'react'
import { Loader } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import { user } from '../../../../utils'

export default function PlaylistPlaceholder({ 
  noPlaylist, signIn 
}) {
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
          {
            user.isLoggedIn()
            ?
            <>
              <p className="text-muted text-center">
                Sorry, you don't have the access to this course.<br/>
                Please ask your instructors for permissions.
              </p>
            </>
            :
            <>
              <p className="text-muted">This course is only available for signed-in users.</p>
              <Button uppercase
                id="ofd-signin-btn"
                color="teal"
                text="Sign in to watch videos!"
                onClick={() => user.signin({ allowTestSignIn: true })}
              />
            </>
          }
        </div>
      }
    </div>
  )
}