import React from 'react';
import { connect } from 'dva';
import { MENU_HIDE, MENU_DOWNLOAD } from '../../../Utils';
import WatchCtrlButton from '../../WatchCtrlButton';

function DownloadMenuTrigger({ menu = MENU_HIDE, dispatch }) {
  const handleMenuTrigger = () => {
    dispatch({type: 'watch/menu_open', payload: { type: MENU_DOWNLOAD, option: 'b'}});
  };

  return (
    <WatchCtrlButton
      onClick={handleMenuTrigger}
      active={menu === MENU_DOWNLOAD}
      position="top"
      label="Download (SHIFT+X)"
      id={MENU_DOWNLOAD}
      ariaTags={{
        'aria-label': `Download Menu`,
        // 'aria-keyshortcuts': 'Shift+X',
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

export default connect(({ watch: { menu } }) => ({
  menu
}))(DownloadMenuTrigger);
