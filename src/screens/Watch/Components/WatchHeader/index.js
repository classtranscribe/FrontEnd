import React, { lazy, Suspense } from 'react'
import { ClassTranscribeHeader } from 'components'
import { Icon } from 'semantic-ui-react'
import './index.css'
// Vars
import { api } from 'utils'
const PlaylistMenu = lazy(() => import('./PlaylistMenu'))

export function WatchHeader({ media, playlist, playlists, sendUserAction }) {
  return (
    <ClassTranscribeHeader darkMode>
        <p className="media-details">
          <strong>
            <span>{api.parseURLFullNumber()}</span>
            &ensp;{playlist.name}
          </strong><br/>
          {/* <Icon name="play" /> */}
          {media.mediaName}
        </p>
      <Suspense fallback={<div>Loading...</div>}>
        <PlaylistMenu media={media} playlist={playlist} playlists={playlists} sendUserAction={sendUserAction} />
      </Suspense>
    </ClassTranscribeHeader>
  )
}