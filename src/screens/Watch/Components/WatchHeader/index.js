import React from 'react'
import { ClassTranscribeHeader } from 'components'
import PlaylistMenu from './PlaylistMenu'
import './index.css'

export function WatchHeader({ media, playlist, courseNumber }) {
  return (
    <ClassTranscribeHeader darkMode>
      <PlaylistMenu media={media} playlist={playlist} courseNumber={courseNumber} />
    </ClassTranscribeHeader>
  )
}