import React from 'react'
import { connectWithRedux } from '_redux/watch'
import { Popup } from 'semantic-ui-react'
import { ClassTranscribeHeader } from 'components'
import { 
  MENU_HIDE, 
  MENU_PLAYLISTS,
  menuControl
} from '../../Utils'
import './index.css'

export function WatchHeaderWithRedux({
  media={},
  playlist={},

  menu=MENU_HIDE,
  isFullscreen=false
}) {

  const handleMenuTrigger = () => {
    document.activeElement.blur()
    if (menu != MENU_PLAYLISTS) menuControl.open(MENU_PLAYLISTS)
    else menuControl.close()
  }

  return isFullscreen ? null : (
    <ClassTranscribeHeader darkMode>
      <Popup inverted wide basic
        position="bottom center"
        //offset="0, 10px"
        openOnTriggerClick={false}
        openOnTriggerFocus
        closeOnTriggerBlur
        content="Playlists"
        trigger={
          <button 
            className="plain-btn watch-playlists-menu-trigger" 
            onClick={handleMenuTrigger}
            aria-label="Playlists Menu"
          >
            <i className="material-icons">list</i>
          </button>
        }
      />
    </ClassTranscribeHeader>
  )
}

export const WatchHeader = connectWithRedux(
  WatchHeaderWithRedux,
  ['media', 'playlist', 'menu', 'isFullscreen'],
  []
)