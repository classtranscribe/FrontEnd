import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import WatchCtrlButton from '../../WatchCtrlButton';
import { CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../../Utils';

export function PlayButtonWithRedux({ paused = true, ctpPriEvent = CTP_LOADING, dispatch }) {
  const ended = ctpPriEvent === CTP_ENDED;
  const cantPlay = ctpPriEvent === CTP_LOADING || ctpPriEvent === CTP_ERROR;
  const handlePause = () => {
    if (ended) {
      dispatch({ type: 'watch/media_reply' })
    } else {
      dispatch({ type: 'watch/onPlayPauseClick' })
    }
  };

  const playButtonRef = useRef();
  useEffect(() => {
    window.focusPlayButton = () => playButtonRef.current?.focus();

    return () => delete window.focusPlayButton;
  })
  return (
    <WatchCtrlButton
      onClick={handlePause}
      label={paused ? 'Play (k)' : 'Pause (k)'}
      disabled={cantPlay}
      // mouseEnterDelay={600}
      ref={playButtonRef}
      id="play-btn"
      ariaTags={{
        'aria-label': ended ? 'Replay' : paused ? 'Play (k)' : 'Pause (k)',
        // 'aria-keyshortcuts': 'k'
      }}
    >
      <span aria-hidden="true" className="watch-btn-content" tabIndex="-1">
        {ended ? (
          <i className="material-icons">replay</i>
        ) : paused ? (
          <i className="material-icons">play_arrow</i>
        ) : (
          <i className="material-icons">pause</i>
        )}
      </span>
    </WatchCtrlButton>
  );
}

export const PlayButton = connect(({ watch: { paused, ctpPriEvent } }) => ({
  paused, ctpPriEvent
}))(PlayButtonWithRedux);
