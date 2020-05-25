import React from 'react';
import { connectWithRedux, menuControl, MENU_HIDE, MENU_SHORTCUTS } from '../../../Utils';

import WatchCtrlButton from '../../WatchCtrlButton';

function ShortcutsTableTrigger({ menu = MENU_HIDE }) {
  const handleMenuTrigger = () => {
    menuControl.open(MENU_SHORTCUTS, 'b');
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_SHORTCUTS}
      position="top"
      label="Shortcuts (SHIFT+/)"
      id={MENU_SHORTCUTS}
      ariaTags={{
        'aria-label': `Shortcuts`,
        // 'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-shortcuts-menu',
        'aria-expanded': menu === MENU_SHORTCUTS ? 'false' : 'true',
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">keyboard</i>
      </span>
    </WatchCtrlButton>
  );
}

export default connectWithRedux(ShortcutsTableTrigger, ['menu']);
