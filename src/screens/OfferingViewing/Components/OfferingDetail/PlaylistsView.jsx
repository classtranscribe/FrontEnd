import React, { useEffect } from 'react'
import { util } from 'utils'

export default function PlaylistsView({ playlists=[], handleClick, wasSelected }) {

  useEffect(() => {
    util.scrollToCenter(wasSelected)
  }, [])

  useEffect(() => {
    if (playlists.length === 1 && playlists[0].id && !playlists[0]['no-use-effect']) {
      playlists[0]['no-use-effect'] = true
      handleClick(playlists[0])
    }
  }, [playlists])

  return (
    <div className="playlists">
      <h2 className="title">
        <i className="material-icons" aria-hidden="true">list</i> Playlists
      </h2>
      <div className="ct-list-col" role="list">
        {
          playlists.map( playlist => (
            <button 
              className="playlist-item" 
              key={playlist.id} 
              id={playlist.id}
              role="listitem"
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
      
    </div>
  )
}