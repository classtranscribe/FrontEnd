import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import Videos from './Videos'
import { util } from 'utils'
import './index.css'

function PlaylistsMenu({
  show=false,
  currMedia={},
  currPlaylist={},
  playlists=[],
  watchHistory=[],
}) {
  const currPlaylistId = currPlaylist.id
  const currMediaId = currMedia.id

  const [selectedPlaylist, setSelectedPlaylist] = useState({ medias: [] })

  useEffect(() => {
    if (playlists.length > 0) {
      setSelectedPlaylist(
        playlists.filter( pl => pl.id === currPlaylistId)[0] || {}
      )
      util.scrollToCenter(currPlaylistId)
    }
  }, [playlists])

  useEffect(() => {
    
  })

  const handlePlaylistClick = playlist => () => {
    setSelectedPlaylist(playlist)
  }

  return (
    <div className="watch-playlists-menu">

      <div className="watch-playlists-list">
        <div className="watch-list-title"><p>Playlists</p></div>
        {playlists.map( playlistItem => (
          <button 
            id={playlistItem.id}
            key={playlistItem.id}
            className="watch-playlist-item plain-btn" 
            onClick={handlePlaylistClick(playlistItem)}
          >
            <i class="material-icons library-icon">video_library</i>
            <p className="playlist-name">
              {playlistItem.name}
              {currPlaylistId === playlistItem.id && <><br/><span>Current Playlist</span></>}
            </p>
            <i class="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>

      <Videos 
        medias={selectedPlaylist.medias.slice().reverse()} 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        selectedPlaylist={selectedPlaylist}
        playlists={playlists}
      />

    </div>
  )
}

export default withRouter(PlaylistsMenu)