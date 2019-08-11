import React, { lazy, Suspense } from 'react'
import { ClassTranscribeHeader } from 'components'
const PlaylistMenu = lazy(() => import('./PlaylistMenu'))

export function WatchHeader({ media, playlist, playlists, courseNumber }) {
  return (
    <ClassTranscribeHeader darkMode>
      <Suspense fallback={<div>Loading...</div>}>
        <PlaylistMenu media={media} playlist={playlist} playlistsInState={playlists} courseNumber={courseNumber} />
      </Suspense>
    </ClassTranscribeHeader>
  )
}