import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { ClassTranscribeHeader } from 'components'
import PlaylistMenuTrigger from './PlaylistMenuTrigger'
import DownloadMenuTrigger from './DownloadMenuTrigger'
import './index.css'

export function WatchHeaderWithRedux({
  media={},
  playlist={},
  isFullscreen=false
}) {

  return isFullscreen ? null : (
    <ClassTranscribeHeader darkMode>
      <DownloadMenuTrigger />
      <PlaylistMenuTrigger />
    </ClassTranscribeHeader>
  )
}

export const WatchHeader = connectWithRedux(
  WatchHeaderWithRedux,
  ['media', 'playlist'],
  []
)