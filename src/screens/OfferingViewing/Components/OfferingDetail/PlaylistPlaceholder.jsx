import React from 'react'
import { Loader } from 'semantic-ui-react'
import { Button } from 'pico-ui'
import { user } from '../../../../utils'

export default function PlaylistPlaceholder({ 
  noPlaylist=false, 
  signIn=false,
  accessType=0,
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
            user.isLoggedIn() // If signed in, then it happens when the accessType is 2 or 3
            ?
            <>
              {
                accessType === 2 ? // Students Only
                <p className="text-muted text-center">
                  Sorry, you don't have the access to this course.<br/>
                  Please ask your instructors for permissions.
                </p>
                :
                accessType === 3 ? // University Only
                <p className="text-muted text-center">
                  Sorry, this course is only available for students of this university.<br/>
                  Please login with an email account of this particular university.
                </p>
                :
                <p className="text-muted text-center">
                  Oooops, something wrong<br/>
                  Failed to load playlists: please make sure you have the permissions for this course.
                </p>
              }
            </>
            : // If unsigned in, ask the user to sign in
            <>
              <p className="text-muted">Sorry, this course is not available for unsigned-in users.</p>
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