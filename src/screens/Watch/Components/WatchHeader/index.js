import React from 'react'
import { ClassTranscribeHeader } from '../../../../components'
import MediaInfo from './MediaInfo'
import PlaylistMenuTrigger from './Buttons/PlaylistMenuTrigger'
import DownloadMenuTrigger from './Buttons/DownloadMenuTrigger'
import ShortcutsTableTrigger from './Buttons/ShortcutsTableTrigger'
import ShareTrigger from './Buttons/ShareTrigger'

import Search from './Search'
import { 
  connectWithRedux,
  SEARCH_INIT, SEARCH_HIDE 
} from '../../Utils'

import './index.css'
import './Buttons/index.css'

export function WatchHeaderWithRedux({
  isFullscreen=false,
  search=SEARCH_INIT,
  plain=false,
}) {

  const showButtons = search.status === SEARCH_HIDE && !plain

  return isFullscreen ? null : (
    <ClassTranscribeHeader 
      darkMode 
      showProfileMenu={search.status === SEARCH_HIDE}
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