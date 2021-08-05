import React from 'react';
import { MENU_HIDE, MENU_SHORTCUTS } from '../../../Utils';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';

function ShortcutsTableTrigger({ menu = MENU_HIDE, dispatch }) {
  const handleMenuTrigger = () => {
    dispatch({type: 'watch/menu_open', payload: { type: MENU_SHORTCUTS, option: 'b'}});
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
        'aria-keyshortcuts': 'Shift+/ ',
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

export default connect(({ watch: { menu }, loading }) => ({
  menu
}))(ShortcutsTableTrigger);
