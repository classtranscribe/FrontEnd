import React from 'react'
import { ClassTranscribeFooter } from 'components'

export default function PlaylistsView({ playlists, handleClick }) {
  return (
    <div className="playlists">
      <p className="title"><i className="material-icons">video_library</i> Playlists</p>
      {
        playlists.map( playlist => (
          <button className="playlist-item" key={playlist.id} tabIndex={1} onClick={() => handleClick(playlist)}>
            <p className="playlist-name">{playlist.name}</p>
            <p className="playlist-vnum">{playlist.medias.length} video(s)</p>
            <i className="material-icons pl-icon">chevron_right</i>
          </button>
        ))
      }
      <ClassTranscribeFooter />
    </div>
  )
}