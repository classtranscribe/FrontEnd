import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import PlaylistView from './PlaylistView'
import Videos from './Videos'
import './index.css'
import { isMobile } from 'react-device-detect'

function PlaylistsMenu({
  onClose=null,
  media={},
  playlist={},
  watchHistory=[],
}) {
  const currMedia = media
  const currMediaId = currMedia.id

  const [currPlaylist, setCurrPlaylist] = useState({})

  useEffect(() => {
    setCurrPlaylist(playlist)
  }, [playlist])

  return ( 
    <div id="watch-playlists-menu" className="watch-playlists-menu">
      {/* Close Btn */}
      <button className="plain-btn watch-menu-close-btn watch-playlists-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      {
        !isMobile
        &&
        <PlaylistView 
          currPlaylist={currPlaylist}
          setCurrPlaylist={setCurrPlaylist}
        />
      }

      {/* Videos view */}
      <Videos 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        currPlaylist={currPlaylist}
      />

    </div>
  )
}

export default connectWithRedux(
  PlaylistsMenu,
  ['media', 'playlist'],
  []
)