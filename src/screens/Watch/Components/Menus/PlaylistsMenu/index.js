import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import Videos from './Videos'
import { util } from '../../../../../utils'
import './index.css'

function PlaylistsMenu({
  onClose=null,
  media={},
  playlist={},
  watchHistory=[],
}) {
  const currMedia = media
  const currMediaId = currMedia.id

  return Array.isArray(playlist.medias) ? ( 
    <div id="watch-playlists-menu" className="watch-playlists-menu">
      {/* Close Btn */}
      <button className="plain-btn watch-menu-close-btn watch-playlists-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      {/* Videos view */}
      <Videos 
        medias={(playlist.medias.slice() || []).reverse()} 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        selectedPlaylist={playlist}
      />

    </div>
  ) : null
}

export default connectWithRedux(
  PlaylistsMenu,
  ['media', 'playlist'],
  []
)