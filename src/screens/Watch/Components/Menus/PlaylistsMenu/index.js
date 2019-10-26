import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.css'

function PlaylistsMenu({
  show=false,
  currMedia={},
  currPlaylist={},
  playlists=[],
}) {
  const currPlaylistId = currPlaylist.id
  return (
    <div className="watch-playlists-menu">
      <div className="watch-playlists-list">
        {playlists.map( playlistItem => (
          <button className="watch-playlist-item plain-btn" key={playlistItem.id}>
            <i class="material-icons library-icon">video_library</i>
            <p className="playlist-name">
              {playlistItem.name}
              {currPlaylistId === playlistItem.id && <><br/><span>Current Playlist</span></>}
            </p>
            <i class="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>

      <div className="watch-videos-list">
          
      </div>
    </div>
  )
}

export default withRouter(PlaylistsMenu)