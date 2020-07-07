import React, { useEffect, useState } from 'react';
import { prompt } from 'utils'
import {
  connectWithRedux,
  modalControl,
  MODAL_HIDE,
  MODAL_SHARE,
  MODAL_BEFORE_HIDE,
} from '../../Utils';

import EmbedModal from './EmbedModal'
import ShareModal from './ShareModal';
import './index.css';

function ModalsWithRedux({ modal = MODAL_HIDE, setModal }) {
  // Register setMenu to menuControl
  useEffect(() => {
    modalControl.register({ setModal });
  }, []);

  const handleClose = () => {
    modalControl.close();
  };

  const [embed, setEmbed] = useState(false);

  const hideBefore = modal === MODAL_BEFORE_HIDE;

  return (
    <div className="watch-modal" data-modal-type={modal}>
      {(modal === MODAL_SHARE || hideBefore) &&
        <ShareModal onClose={handleClose} embed={embed} setEmbed={setEmbed} />}
      <div className="wml-filter" onClick={handleClose} />
      <EmbedModal
        open={embed}
        onClose={() => setEmbed(false)}
        onConfirm={() => prompt.addOne({
          text: 'Content copied to clipboard.',
          status: 'success',
          timeout: 2000,
        }, true)}
      />
    </div>
  );
}

export const Modals = connectWithRedux(ModalsWithRedux, ['modal'], ['setModal']);
