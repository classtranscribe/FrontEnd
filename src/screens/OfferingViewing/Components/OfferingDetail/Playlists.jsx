import React, { useState } from 'react'
import { PlaceHolder } from '../../../../components'
import PlaylistsView from './PlaylistsView'
import VideoView from './VideoView'
import PlaylistPlaceholder from './PlaylistPlaceholder'

export default function Playlists({ 
  playlists, 
  fullNumber, 
  watchHistoryJSON 
}) {
  const [playlistId, setPlaylistId] = useState('prev-')

  if (playlists && playlists.length === 0) return <PlaylistPlaceholder noPlaylist />
  if (playlists && playlists[0] === 'need-signin') return <PlaylistPlaceholder signIn />
  
  const handlePlaylistClick = playlist => {
    setPlaylistId(playlist.id)
  }

  const goBack = () => {
    setPlaylistId('prev-' + playlistId)
  }

  const isPlaylistsView = playlistId.startsWith('prev-')

  return (
    <div className="playlist-container">
      {
        !playlists
        ?
        <PlaceHolder />
        :
        isPlaylistsView 
        ?
        <PlaylistsView 
          playlists={playlists} 
          handleClick={handlePlaylistClick} 
          wasSelected={playlistId.replace('prev-', '')}
        />
        :
        <VideoView 
          playlistId={playlistId} 
          playlists={playlists}
          courseNumber={fullNumber}
          watchHistoryJSON={watchHistoryJSON}
          goBack={goBack} 
        />
      }
    </div>
  )
}