import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from './WatchCtrlButton'
import { 
  MENU_HIDE, MENU_DOWNLOAD, 
  menuControl
} from '../../../Utils'

export function DownloadButtonWithRedux({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    if (menu !== MENU_DOWNLOAD) {
      menuControl.open(MENU_DOWNLOAD)
    } else {
      menuControl.close()
    }
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_DOWNLOAD}
      label="Download"
    >
      <span className="watch-btn-content" tabIndex="-1">
        <i className="material-icons">cloud_download</i>     
      </span>
    </WatchCtrlButton>
  )
}

export const DownloadButton = connectWithRedux(
  DownloadButtonWithRedux,
  ['menu'],
  []
)