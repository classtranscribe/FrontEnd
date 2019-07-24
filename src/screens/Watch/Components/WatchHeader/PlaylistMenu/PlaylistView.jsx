import React from 'react'
import { MenuItem } from '@material-ui/core'
import { Divider } from 'semantic-ui-react'

export default function PlaylistsView({playlists, courseNumber, selectedPlaylist, goToPlaylist}) {
  return (
    <>
      <MenuItem className="header" disabled>
        <h4>{courseNumber}</h4>&ensp;Playlists
      </MenuItem>
      <Divider style={{width: '25em', margin: '0'}} inverted />
      {playlists.map( playlist => (
        <PlaylistItem playlist={playlist} selectedPlaylist={selectedPlaylist} goToPlaylist={goToPlaylist} />
      ))}
    </>
  )
}

function PlaylistItem({ playlist, selectedPlaylist, goToPlaylist }) {
  const { name, id } = playlist
  let fittedName = name.slice(0, 30)
  if (fittedName !== name) fittedName += '...'
  return (
    <MenuItem 
      className="pl-item" 
      selected={id === selectedPlaylist.id}
      onClick={() => goToPlaylist(playlist)}
    >
      <i class="material-icons">video_library</i>
      &ensp;{fittedName}
      <i class="material-icons">chevron_right</i>
    </MenuItem>
  )
}