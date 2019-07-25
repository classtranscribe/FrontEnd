import React, { useState, useEffect } from 'react'
// UI
import { IconButton, Menu } from '@material-ui/core'
import { CSSTransition } from 'react-transition-group'
import PlaylistsView from './PlaylistView'
import VideosView from './VideosView'
import './transition.css'
import './index.css'
// Vars
import { api } from 'utils'
const emptyPlaylist = {name: '', id: ''}
const menuStyle = {
  backgroundColor: '#424242', 
  color: 'rgb(236, 236, 236)',
  width: '25em',
  height: '90%'
}

export default function PlaylistMenu({ media, playlist, courseNumber }) {
  return <></>
  const [anchorEl, setAnchorEl] = useState(null)
  const [playlists, setPlaylists] = useState([])
  const [selectedPlaylist, setSelectedPlaylist] = useState(emptyPlaylist)
  const [medias, setMedias] = useState([])

  useEffect(() => {
    if (playlist.playlist) {
      setSelectedPlaylist(() => playlist.playlist)
      api.getPlaylistsByOfferingId(playlist.playlist.offeringId)
        .then(({data}) => {
          console.log('playlists..', data)
          setPlaylists(() => data)
        })
    }
    if (playlist.medias) {
      setMedias(() => playlist.medias)
    }
  }, [playlist])

  const backToPlaylists = () => {
    setSelectedPlaylist(() => emptyPlaylist)
    setTimeout(() => {
      const currMediaEle = document.getElementById(media.id)
      if (currMediaEle) currMediaEle.scrollIntoView({ behavior: "smooth", block: "center" })
    }, 200);
  }

  const goToPlaylist = playlist => {
    setSelectedPlaylist(() => playlist)
    if (playlist.medias) setMedias(() => playlist.medias)
  }

  function handleClick(event) {
    setAnchorEl(event.currentTarget)
    // scrollToCurrVideo()
  }

  function handleClose() {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)

  return (
    <div className="playlist-menu">
      <IconButton
        aria-label="Mode Setting"
        title="Mode Setting"
        aria-controls="mode-menu"
        aria-haspopup="true"
        onClick={handleClick}
        className="trigger"
      >
        <i class="material-icons">format_list_bulleted</i>&ensp;
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        className="playlist-menu"
        PaperProps={{style: menuStyle}}
      >
        <CSSTransition in={!Boolean(selectedPlaylist.id)} classNames="playlist-view" timeout={200}>
          <PlaylistsView 
            playlists={playlists} 
            courseNumber={courseNumber} 
            selectedPlaylist={selectedPlaylist} 
            goToPlaylist={goToPlaylist}
          />
        </CSSTransition>
        <CSSTransition in={Boolean(selectedPlaylist.id)} classNames="video-view" timeout={200}>
          <VideosView 
            medias={medias} 
            currMedia={media} 
            courseNumber={courseNumber} 
            selectedPlaylist={selectedPlaylist} 
            backToPlaylists={backToPlaylists}
          />
        </CSSTransition>
      </Menu>
    </div>
  )
}
