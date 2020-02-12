import React from 'react'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  MENU_HIDE, MENU_DOWNLOAD, 
  connectWithRedux,
  menuControl
} from '../../../Utils'

export function DownloadMenuTrigger({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    menuControl.open(MENU_DOWNLOAD, 'b')
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_DOWNLOAD}
      position="top"
      label="Download (SHIFT+D)"
      id={MENU_DOWNLOAD}
      ariaTags={{
        'aria-label': `Download Menu`,
        //'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-download-menu',
        'aria-haspopup': 'true'
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
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