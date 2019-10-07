import React, { useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import PlaylistsView from './PlaylistsView'
import VideoView from './VideoView'
import PlaylistPlaceholder from './PlaylistPlaceholder'

export default function Playlists({ playlists, fullNumber }) {
  const [selectedPlaylist, setSelectedPlaylist] = useState({})

  if (!playlists) return <PlaylistPlaceholder />
  if (playlists.length === 0) return <PlaylistPlaceholder noPlaylist />
  if (playlists[0] === 'need-signin') return <PlaylistPlaceholder signIn />
  
  const handleClick = playlist => {
    setSelectedPlaylist(playlist)
  }

  const isPlaylistsView = !Boolean(selectedPlaylist.id)

  return (
    <div className="playlist-container">
      <CSSTransition in={isPlaylistsView} unmountOnExit classNames="playlist-view" timeout={100}>
        <PlaylistsView 
          playlists={playlists} 
          handleClick={handleClick} 
          wasSelected={selectedPlaylist}
        />
      </CSSTransition>
      <CSSTransition in={!isPlaylistsView} unmountOnExit classNames="video-view" timeout={100}>
        <VideoView 
          playlist={selectedPlaylist} 
          playlists={playlists}
          courseNumber={fullNumber}
          goBack={() => handleClick(selectedPlaylist.id)} 
        />
      </CSSTransition>
    </div>
  )
}