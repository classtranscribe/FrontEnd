import React from 'react'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'
import { api } from 'utils'

export default function PlaylistsView({currMedia, playlists, courseNumber, goToPlaylist, handleClose}) {
  return (
    <div className="playlist-view">
      <MenuItem className="header" onClick={handleClose}>
        <span><strong>{api.parseURLFullNumber(courseNumber)}</strong>&ensp;Playlists</span>
        <i className="material-icons close-btn">close</i>
      </MenuItem>
      <Divider style={{width: '370px', margin: '0'}} inverted />
      {playlists.map( playlist => (
        <PlaylistItem key={playlist.id} playlist={playlist} currMedia={currMedia} goToPlaylist={goToPlaylist} />
      ))}
    </div>
  )
}

function PlaylistItem({ playlist, currMedia, goToPlaylist }) {
  const { name, id } = playlist
  let fittedName = name ? name.slice(0, 40) : 'unknown'
  if (fittedName !== name) fittedName += '...'
  return (
    <MenuItem 
      className="pl-item" 
      selected={id === currMedia.playlistId}
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