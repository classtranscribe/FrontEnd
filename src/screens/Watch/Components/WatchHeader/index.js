import React from 'react'
import { connectWithRedux } from '../../../../_redux/watch'
import { ClassTranscribeHeader } from '../../../../components'
import MediaInfo from './MediaInfo'
import PlaylistMenuTrigger from './Buttons/PlaylistMenuTrigger'
import DownloadMenuTrigger from './Buttons/DownloadMenuTrigger'
import ShortcutsTableTrigger from './Buttons/ShortcutsTableTrigger'
import ShareTrigger from './Buttons/ShareTrigger'

import Search from './Search'
import { SEARCH_INIT, SEARCH_HIDE } from '../../Utils'

import './index.css'
import './Buttons/index.css'

export function WatchHeaderWithRedux({
  isFullscreen=false,
  search=SEARCH_INIT
}) {

  const showButtons = search.status === SEARCH_HIDE

  return isFullscreen ? null : (
    <ClassTranscribeHeader 
      darkMode 
      showProfileMenu={showButtons}
      leftElem={<MediaInfo />}
      rightElem={ !showButtons ? null :
        <>
          <Search />
          <ShortcutsTableTrigger />
          <ShareTrigger />
          <DownloadMenuTrigger />
          <PlaylistMenuTrigger />
        </>
      }
    />
  )
}

export const WatchHeader = connectWithRedux(
  WatchHeaderWithRedux,
  ['isFullscreen', 'search'],
  []
)