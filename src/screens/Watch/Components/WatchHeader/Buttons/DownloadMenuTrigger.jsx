import React from 'react';
import { connectWithRedux, menuControl, MENU_HIDE, MENU_DOWNLOAD } from '../../../Utils';

import WatchCtrlButton from '../../WatchCtrlButton';

function DownloadMenuTrigger({ menu = MENU_HIDE }) {
  const handleMenuTrigger = () => {
    menuControl.open(MENU_DOWNLOAD, 'b');
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_DOWNLOAD}
      position="top"
      label="Download (SHIFT+D)"
      id={MENU_DOWNLOAD}
      ariaTags={{
        'aria-label': `Download Menu`,
        // 'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-download-menu',
        'aria-expanded': menu === MENU_DOWNLOAD ? 'false' : 'true',
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">cloud_download</i>
      </span>
    </WatchCtrlButton>
  );
}

export default connectWithRedux(DownloadMenuTrigger, ['menu']);
