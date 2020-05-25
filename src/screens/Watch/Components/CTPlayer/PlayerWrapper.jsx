import React from 'react';
import { connectWithRedux, videoControl, CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../Utils';
import './index.css';

import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption,
  AudioDescription,
} from '../Overlays';

function PlayerWrapper({ isPrimary = false, ctpPriEvent = CTP_LOADING }) {
  const shouldBlur = [CTP_LOADING, CTP_ENDED, CTP_ERROR].includes(ctpPriEvent);
  const handleClick = () => {
    if (!shouldBlur) {
      videoControl.handlePause();
    }
  };

  return isPrimary ? (
    <div className="watch-player-wrapper" onClick={handleClick} data-blur={shouldBlur.toString()}>
      {ctpPriEvent === CTP_ERROR ? (
        <div className="ctp-error-wrapper">Media Unavailable</div>
      ) : (
        <>
          <ClosedCaption isPrimary={isPrimary} />
          <BigPlayButton isPrimary={isPrimary} />
          <AudioDescription isPrimary={isPrimary} />
        </>
      )}
    </div>
  ) : (
    <SecondaryPlayerWrapper isPrimary={isPrimary} />
  );
}

export default connectWithRedux(PlayerWrapper, ['ctpPriEvent']);
