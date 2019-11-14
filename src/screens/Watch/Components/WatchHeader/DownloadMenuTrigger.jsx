import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../ControlBar/CtrlButtons/WatchCtrlButton'
import { 
  MENU_HIDE, MENU_DOWNLOAD, 
  menuControl
} from '../../Utils'

export function DownloadMenuTrigger({
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
      position="top"
      label="Download"
      ariaLabel="Download Menu"
      id={MENU_DOWNLOAD}
    >
      <span className="watch-btn-content watch-header-btn" tabIndex="-1">
        <i className="material-icons">cloud_download</i>     
      </span>
    </WatchCtrlButton>
  )
}

export default connectWithRedux(
  DownloadMenuTrigger,
  ['menu'],
  []
)