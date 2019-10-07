import React, { useEffect } from 'react'
import { util } from 'utils'

export default function PlaylistsView({ playlists, handleClick, wasSelected }) {

  useEffect(() => {
    util.scrollToCenter(wasSelected)
  }, [])

  return (
    <div className="playlists">
      <p className="title"><i className="material-icons">list</i> Playlists</p>
      {
        playlists.map( playlist => (
          <button 
            className="playlist-item" 
            key={playlist.id} 
            id={playlist.id}
            onClick={() => handleClick(playlist)}
            aria-label={`Playlist: ${playlist.name}`}
          >
            <p className="playlist-name"><i className="material-icons">video_library</i>{playlist.name}</p>
            <p className="playlist-vnum">{playlist.medias.length} video(s)</p>
            <i className="material-icons pl-icon">chevron_right</i>
          </button>
        ))
      }
      
    </div>
  )
}