import React, { useState, useEffect } from 'react'
// UI
import { IconButton, Menu } from '@material-ui/core'
import { CSSTransition } from 'react-transition-group'
import PlaylistsView from './PlaylistView'
import VideosView from './VideosView'
import './index.css'
// Vars
import { util } from 'utils'
const menuStyle = {
  backgroundColor: '#424242', 
  color: 'rgb(236, 236, 236)',
  width: '370px',
  height: '650px',
}

export default function PlaylistMenu({ media, playlist, playlists, sendUserAction }) {
  // return <></>
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedPlaylist, setSelectedPlaylist] = useState({})
  const [medias, setMedias] = useState([])

  useEffect(() => {
    if (playlist.medias) {
      setSelectedPlaylist(playlist)
      setMedias(playlist.medias)
    }
  }, [playlist])

  const backToPlaylists = () => {
    setSelectedPlaylist({})
    setTimeout(() => {
      util.scrollToCenter(playlist.id)
    }, 100)
  }

  const goToPlaylist = currPlaylist => {
    setSelectedPlaylist(currPlaylist)
    if (currPlaylist.medias) setMedias(currPlaylist.medias)
    setTimeout(() => {
      util.scrollToCenter(media.id)
    }, 100)
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
    util.scrollToCenter(media.id)
  }

  function handleClose() {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const isPlaylistView = !Boolean(selectedPlaylist.id)

  return (
    <div className="playlist-menu">
      <IconButton
        aria-label="Playlist menu"
        title="Playlist menu"
        aria-controls="mode-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="trigger"
      >
        <i className="material-icons">format_list_bulleted</i>&ensp;
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        className="playlist-menu"
        PaperProps={{style: menuStyle}}
      >
        <CSSTransition in={isPlaylistView} unmountOnExit classNames="playlist-view" timeout={100}>
          <PlaylistsView 
            currMedia={media} 
            playlists={playlists} 
            selectedPlaylist={selectedPlaylist} 
            goToPlaylist={goToPlaylist}
            handleClose={handleClose}
          />
        </CSSTransition>
        <CSSTransition in={!isPlaylistView} unmountOnExit classNames="video-view" timeout={100}>
          <VideosView 
            medias={medias} 
            currMedia={media} 
            playlists={playlists}
            selectedPlaylist={selectedPlaylist} 
            backToPlaylists={backToPlaylists}
            handleClose={handleClose}
            sendUserAction={sendUserAction}
          />
        </CSSTransition>
      </Menu>
    </div>
  )
}
