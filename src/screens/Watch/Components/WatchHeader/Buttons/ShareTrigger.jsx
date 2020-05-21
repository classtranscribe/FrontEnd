import React from 'react';
import { connectWithRedux, modalControl, MODAL_SHARE, MODAL_HIDE } from '../../../Utils';

import WatchCtrlButton from '../../WatchCtrlButton';

function ShareTrigger({ modal = MODAL_HIDE }) {
  const handleShare = () => {
    modalControl.open(MODAL_SHARE);
  };

  return (
    <WatchCtrlButton
      onClick={handleShare}
      position="top"
      label="Share"
      id="watch-share-btn"
      active={modal === MODAL_SHARE}
      ariaTags={{
        'aria-label': `Share`,
        // 'aria-keyshortcuts': 'Shift+D',
        'aria-controls': 'watch-share-modal',
        'aria-expanded': modal === MODAL_SHARE ? 'false' : 'true',
      }}
    >
      <span className="watch-btn-content watch-header-btn-content" tabIndex="-1">
        <i className="material-icons">share</i>
        {/* <i className="fas fa-share"></i> */}
      </span>
    </WatchCtrlButton>
  );
}

export default connectWithRedux(ShareTrigger, ['modal']);
