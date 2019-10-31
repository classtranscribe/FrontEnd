import React from 'react'
import PlaylistsMenu from './PlaylistsMenu'
import {
  MENU_HIDE,
  MENU_PLAYLISTS,
  MENU_PLAYBACKRATE,
  MENU_CAPTIONS,
  MENU_SCREEN_MODE,
  MENU_DOWNLOAD,
} from '../../Utils'
import './index.css'

const type = MENU_PLAYLISTS

export function Menus({
  media,
  playlist,
  playlists,
}) {
  return (
    <div className={`watch-menus`} type={type}>
      <PlaylistsMenu 
        show={type === MENU_PLAYLISTS}  
        currMedia={media}
        currPlaylist={playlist}
        playlists={playlists}
      />
    </div>
  )
}