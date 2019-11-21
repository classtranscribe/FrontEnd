import React from 'react'
import { connectWithRedux } from '_redux/watch'
import WatchCtrlButton from '../ControlBar/CtrlButtons/WatchCtrlButton'
import { 
  MENU_HIDE, MENU_TRANSLATION, 
  menuControl
} from '../../Utils'

export function TranslationMenuTrigger({
  menu=MENU_HIDE,
}) {

  const handleMenuTrigger = () => {
    menuControl.open(MENU_TRANSLATION, 'b')
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_TRANSLATION}
      position="top"
      label={<>Translate the page to: <strong>{'English'}</strong></>}
      ariaTags={{
        'aria-label': `Translation options`,
        //'aria-keyshortcuts': 'Shift+P',
        //'aria-controls': 'watch-playlists-menu',
        //'aria-haspopup': 'true'
      }}
      id={MENU_TRANSLATION}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">translate</i>     
      </span>
    </WatchCtrlButton>
  )
}

export default connectWithRedux(
  TranslationMenuTrigger,
  ['menu'],
  []
)