import React from 'react';
import { MENU_HIDE, MENU_DOWNLOAD } from '../../../Utils';
import { connect } from 'dva';
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

export default connect(({ watch: { menu }, loading }) => ({
  menu
}))(DownloadMenuTrigger);
