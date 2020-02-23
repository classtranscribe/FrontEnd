import React from 'react'
import WatchCtrlButton from '../../WatchCtrlButton'
import { 
  MENU_HIDE, MENU_SHORTCUTS,
  connectWithRedux,
  menuControl
} from '../../../Utils'

function ShortcutsTableTrigger({
  menu=MENU_HIDE
}) {

  const handleMenuTrigger = () => {
    menuControl.open(MENU_SHORTCUTS, 'b')
  }

  return (
    <WatchCtrlButton 
      onClick={handleMenuTrigger}
      active={menu === MENU_SHORTCUTS}
      position="top"
      label="Shortcuts (SHIFT+/)"
      id={MENU_SHORTCUTS}
      ariaTags={{
        'aria-label': `Shortcuts`,
        //'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-shortcuts-menu',
        'aria-haspopup': 'true'
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">keyboard</i>     
      </span>
    </WatchCtrlButton>
  )
}

export default connectWithRedux(
  ShortcutsTableTrigger,
  ['menu'],
  []
)