import React, { useEffect, useState } from 'react';
import { prompt } from 'utils'
import EmbedVideo from 'layout/CTModal/EmbedVideo'
import {
  videoControl,
  parseSec,
  connectWithRedux,
  modalControl,
  MODAL_HIDE,
  MODAL_SHARE,
  MODAL_BEFORE_HIDE,
} from '../../Utils';

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
  const [ccLanguage, setCCLanguage] = useState('en-US')
  const [playbackRate, setplaybackRate] = useState(4)
  const [width, setWidth] = useState(480);
  const [height, setHeight] = useState(270);
  const handleWidthChange = ({ target: { value } }) => {
    setWidth(value);
  };
  const handleHeightChange = ({ target: { value } }) => {
    setHeight(value);
  };

  const handleCCLanguageChange = ({ target: { value } }) => {
    setCCLanguage(value);
  };
  const handlePlaybackRateChange = ({ target: { value } }) => {
    setplaybackRate(value);
  };

  const hideBefore = modal === MODAL_BEFORE_HIDE;

  return (
    <div className="watch-modal" data-modal-type={modal}>
      {(modal === MODAL_SHARE || hideBefore) &&
        <ShareModal onClose={handleClose} embed={embed} setEmbed={setEmbed} />}
      <div className="wml-filter" onClick={handleClose} />
      <EmbedVideo
        open={embed}
        onClose={() => setEmbed(false)}
        onConfirm={() => prompt.addOne({
          text: 'Content copied to clipboard.',
          status: 'success',
          timeout: 2000,
        }, true)}
        videoControl={videoControl}
        parseSec={parseSec}
        ccLanguage={ccLanguage}
        handleCCLanguageChange={handleCCLanguageChange}
        playbackRate={playbackRate}
        handlePlaybackRateChange={handlePlaybackRateChange}
        width={width}
        height={height}
        handleWidthChange={handleWidthChange}
        handleHeightChange={handleHeightChange}
      />
    </div>
  );
}

export const Modals = connectWithRedux(ModalsWithRedux, ['modal'], ['setModal']);
