import React from 'react';
import { connect } from 'dva'
import { CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../Utils';
import './index.scss';

import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption,
  AudioDescription,
} from '../Overlays';

function PlayerWrapper(props) {
  const { ctpPriEvent = CTP_LOADING, isPrimary = false, dispatch } = props;
  const shouldBlur = [CTP_LOADING, CTP_ENDED, CTP_ERROR].includes(ctpPriEvent);
  const handleClick = () => {
    if (!shouldBlur) {
      dispatch({ type: 'watch/onPlayPauseClick' });
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

export default connect(({ watch: { ctpPriEvent }, loading }) => ({
  ctpPriEvent
}))(PlayerWrapper);
