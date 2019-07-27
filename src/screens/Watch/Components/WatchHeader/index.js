import React from 'react'
import { ClassTranscribeHeader } from 'components'
import PlaylistMenu from './PlaylistMenu'

export function WatchHeader({ media, playlist, courseNumber }) {
  return (
    <ClassTranscribeHeader darkMode>
      <PlaylistMenu media={media} playlist={playlist} courseNumber={courseNumber} />
    </ClassTranscribeHeader>
  )
}