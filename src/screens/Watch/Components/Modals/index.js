import React, { useEffect, useState } from 'react';
import { connect } from 'dva'
import {
  MODAL_HIDE,
  MODAL_SHARE,
  MODAL_BEFORE_HIDE,
} from '../../Utils';
import EmbedModal from './EmbedModal'
import ShareModal from './ShareModal';
import './index.scss';

function ModalsWithRedux({ modal = MODAL_HIDE, dispatch, media }) {
  const handleClose = () => {
    dispatch({ type: 'watch/modal_close' });
  };

  const [embed, setEmbed] = useState(false);
  const hideBefore = modal === MODAL_BEFORE_HIDE;

  return (
    <>
      <div className="watch-modal" data-modal-type={modal}>
        {(modal === MODAL_SHARE || hideBefore) &&
          <ShareModal onClose={handleClose} embed={embed} setEmbed={setEmbed} />}
        <div className="wml-filter" onClick={handleClose} />
      </div>
      {
        embed
        &&
        <EmbedModal media={media} onClose={() => setEmbed(false)} />
      }
    </>
  );
}

export const Modals = connect(({ watch: { modal, media }, loading }) => ({
  modal, media
}))(ModalsWithRedux);
