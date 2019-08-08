import React from 'react'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'

export default function PlaylistsView({playlists, courseNumber, selectedPlaylist, goToPlaylist}) {
  return (
    <div className="playlist-view">
      <MenuItem className="header" disabled>
        <h4>{courseNumber}</h4>&ensp;Playlists
      </MenuItem>
      <Divider style={{width: '25em', margin: '0'}} inverted />
      {playlists.map( playlist => (
        <PlaylistItem key={playlist.id} playlist={playlist} selectedPlaylist={selectedPlaylist} goToPlaylist={goToPlaylist} />
      ))}
    </div>
  )
}

function PlaylistItem({ playlist, selectedPlaylist, goToPlaylist }) {
  const { name, id } = playlist
  let fittedName = name ? name.slice(0, 40) : 'unknown'
  if (fittedName !== name) fittedName += '...'
  return (
    <MenuItem 
      className="pl-item" 
      selected={id === selectedPlaylist.id}
      onClick={() => goToPlaylist(playlist)}
      aria-label={`View playlist ${name}`}
      title={name}
    >
      <i className="material-icons">video_library</i>
      &ensp;{fittedName}
      <i className="material-icons r-icon">chevron_right</i>
    </MenuItem>
  )
}