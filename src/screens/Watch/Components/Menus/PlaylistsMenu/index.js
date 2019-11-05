import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import { connectWithRedux } from '_redux/watch'
import Videos from './Videos'
import { util, api } from 'utils'
import { findUpNextMedia } from '../../../Utils'
import './index.css'

function PlaylistsMenu({
  show=false,
  onClose=null,
  // currMedia={},
  // currPlaylist={},
  media={},
  playlist={},
  playlists=[],
  watchHistory=[],
}) {
  const currMedia = media
  const currPlaylist = playlist
  const currPlaylistId = currPlaylist.id
  const currMediaId = currMedia.id

  const upNextMedia = findUpNextMedia({ 
    playlist: currPlaylist,
    currMediaId,
    currPlaylistId,
    playlists: playlists.length > 0 ? playlists : undefined
  })
  
  /** 
   * @TODO upNextMedia 
   */
  console.log('upNextMedia', api.parseMedia(upNextMedia))

  const [selectedPlaylist, setSelectedPlaylist] = useState({ name: '', medias: [] })

  useEffect(() => {
    if (playlists.length > 0) {
      setSelectedPlaylist(
        playlists.find( pl => pl.id === currPlaylistId) || {}
      )
      util.scrollToCenter(currPlaylistId)
    }
  }, [playlists])

  const handlePlaylistClick = playlist => () => {
    setSelectedPlaylist(playlist)
  }

  return show ? (
    <div className="watch-playlists-menu">
      {/* Close Btn */}
      <button className="plain-btn watch-menu-close-btn watch-playlists-menu-close-btn" onClick={onClose}>
        <i className="material-icons">close</i>
      </button>

      {/* Playlists view */}
      <div className="watch-playlists-list">
        <div className="watch-list-title"><p>Playlists</p></div>
        {playlists.map( playlistItem => (
          <button 
            id={playlistItem.id}
            key={playlistItem.id}
            className="watch-playlist-item plain-btn" 
            onClick={handlePlaylistClick(playlistItem)}
          >
            <i className="material-icons library-icon">video_library</i>
            <p className="playlist-name">
              {playlistItem.name}
              {currPlaylistId === playlistItem.id && <><br/><span>Current Playlist</span></>}
            </p>
            <i className="material-icons right-arrow">chevron_right</i>
          </button>
        ))}
      </div>

      {/* Videos view */}
      <Videos 
        medias={selectedPlaylist.medias.slice().reverse()} 
        currMediaId={currMediaId}  
        watchHistory={watchHistory}
        selectedPlaylist={selectedPlaylist}
        playlists={playlists}
      />

    </div>
  ) : null;
}

export default connectWithRedux(PlaylistsMenu)