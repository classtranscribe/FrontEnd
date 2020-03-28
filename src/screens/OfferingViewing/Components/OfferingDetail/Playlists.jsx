import React, { useState, useEffect } from 'react'
import { PlaceHolder } from '../../../../components'
import PlaylistsView from './PlaylistsView'
import VideoView from './VideoView'
import PlaylistPlaceholder from './PlaylistPlaceholder'
import { util } from 'utils'

export default function Playlists({ 
  accessType=0,
  playlists, 
  fullNumber='', 
  watchHistoryJSON 
}) {
  const [playlistId, setPlaylistId] = useState('prev-')

  useEffect(() => {
    const { plid } = util.links.useSearch()
    if (plid) {
      setPlaylistId(plid)
    }
  }, [])

  if (playlists && playlists.length === 0) return <PlaylistPlaceholder noPlaylist />
  if (playlists && playlists[0] === 'need-signin') return <PlaylistPlaceholder signIn accessType={accessType} />
  
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
          wasSelected={(playlistId || '').replace('prev-', '')}
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