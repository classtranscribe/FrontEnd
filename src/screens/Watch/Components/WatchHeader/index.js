import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { ClassTranscribeHeader } from 'components'
import PlaylistMenuTrigger from './PlaylistMenuTrigger'
import DownloadMenuTrigger from './DownloadMenuTrigger'
import TranslationMenuTrigger from './TranslationMenuTrigger'
import './index.css'

export function WatchHeaderWithRedux({
  media={},
  playlist={},
  isFullscreen=false
}) {

  return isFullscreen ? null : (
    <ClassTranscribeHeader darkMode>
      <DownloadMenuTrigger />
      {/* <TranslationMenuTrigger /> */}
      <PlaylistMenuTrigger />
    </ClassTranscribeHeader>
  )
}

export const WatchHeader = connectWithRedux(
  WatchHeaderWithRedux,
  ['media', 'playlist'],
  []
)