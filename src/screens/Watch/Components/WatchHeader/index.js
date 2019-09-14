import React, { lazy, Suspense } from 'react'
import { ClassTranscribeHeader } from 'components'
const PlaylistMenu = lazy(() => import('./PlaylistMenu'))

export function WatchHeader({ media, playlist, playlists, sendUserAction }) {
  return (
    <ClassTranscribeHeader darkMode>
      <Suspense fallback={<div>Loading...</div>}>
        <PlaylistMenu media={media} playlist={playlist} playlists={playlists} sendUserAction={sendUserAction} />
      </Suspense>
    </ClassTranscribeHeader>
  )
}