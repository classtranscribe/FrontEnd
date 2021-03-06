import React from 'react';
import { modalControl, MODAL_SHARE, MODAL_HIDE } from '../../../Utils';
import { connect } from 'dva';
import WatchCtrlButton from '../../WatchCtrlButton';

function ShareTrigger({ modal = MODAL_HIDE, dispatch }) {
  const handleShare = () => {
    dispatch({type: 'watch/modal_open', payload: { type: MODAL_SHARE } });
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

export default connect(({ watch: { modal }, loading }) => ({
  modal
}))(ShareTrigger);
