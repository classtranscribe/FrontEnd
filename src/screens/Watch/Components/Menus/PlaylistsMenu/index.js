import React, { useState, useEffect } from 'react'
import _ from 'lodash'
import { connectWithRedux } from '../../../Utils'
import Videos from './Videos'
import { util } from '../../../../../utils'
import './index.css'

function PlaylistsMenu({
  show=false,
  onClose=null,
  media={},
  playlist={},
  playlists=[],
  watchHistory=[],
}) {
  const currMedia = media
  const currPlaylist = playlist
  const currPlaylistId = currPlaylist.id
  const currMediaId = currMedia.id

  const [selectedPlaylist, setSelectedPlaylist] = useState({ name: '', medias: [], id:'' })

  useEffect(() => {
    if (playlists.length > 0) {
      setSelectedPlaylist(_.find(playlists, pl => pl.id === currPlaylistId) || {})
      util.scrollToCenter(currPlaylistId)
    }
  }, [playlists])

  const handlePlaylistClick = playlist => () => {
    setSelectedPlaylist(playlist)
  }

  return ( 
    <div id="watch-playlists-menu" className="watch-playlists-menu">
      {/* Close Btn */}
      <button className="plain-btn watch-menu-close-btn watch-playlists-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      {/* Playlists view */}
      <div className="watch-playlists-list">
        <div className="watch-list-title"><p>Playlists</p></div>
        <div role="list" className="w-100 d-flex flex-column">
          {playlists.map( playlistItem => (
            <button 
              id={playlistItem.id}
              key={playlistItem.id}
              className="watch-playlist-item plain-btn" 
              role="listitem"
              onClick={handlePlaylistClick(playlistItem)}
              current={Boolean(currPlaylistId === playlistItem.id).toString()}
              active={Boolean(selectedPlaylist.id === playlistItem.id).toString()}
            >
              <i className="material-icons library-icon">video_library</i>
              <p className="playlist-name">
                {playlistItem.name}
                {currPlaylistId === playlistItem.id && <><br/><span>Current Playlist</span></>}
              </p>
              <i className="material-icons right-arrow">chevron_right</i>
            </button>
          ))}
        </div>
      </div>

      {/* Videos view */}
      <Videos 
        medias={(selectedPlaylist.medias.slice() || []).reverse()} 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        selectedPlaylist={selectedPlaylist}
        playlists={playlists}
      />

    </div>
  )
}

export default connectWithRedux(
  PlaylistsMenu,
  ['media', 'playlist', 'playlists'],
  []
)