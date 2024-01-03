import React from 'react';
import { connect } from 'dva'
import { CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../Utils';
import './index.scss';

import {
  SecondaryPlayerWrapper,
  BigPlayButton,
  ClosedCaption,
  // AudioDescription,
  FlashWarningButton,
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
    // Clicking on the player will play/pause the video. 
    // Keyboard users can use the shortcut "Space" and k to play/pause the video.
    // Play and pause is also supported by the play/pause button
    // So (IMHO) there is no need to add equivalent keyboard and aria support here.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div className="watch-player-wrapper" onClick={handleClick} data-blur={shouldBlur.toString()}>
      {ctpPriEvent === CTP_ERROR ? (
        <div className="ctp-error-wrapper">Media Unavailable</div>
      ) : (
        <>
          <ClosedCaption isPrimary={isPrimary} />
          <BigPlayButton isPrimary={isPrimary} />
          <FlashWarningButton isPrimary={isPrimary} />
          {/* <AudioDescription isPrimary={isPrimary} /> */}
        </>
        )}
    </div>
  ) : (
    <SecondaryPlayerWrapper isPrimary={isPrimary} />
    );
}

export default connect(({ watch: { ctpPriEvent } }) => ({
  ctpPriEvent
}))(PlayerWrapper);
