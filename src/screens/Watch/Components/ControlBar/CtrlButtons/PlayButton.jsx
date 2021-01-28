import React from 'react';
import WatchCtrlButton from '../../WatchCtrlButton';
import { CTP_LOADING, CTP_ENDED, CTP_ERROR } from '../../../Utils';
import { connect } from 'dva'

export function PlayButtonWithRedux({ paused = true, ctpPriEvent = CTP_LOADING, dispatch }) {
  const ended = ctpPriEvent === CTP_ENDED;
  const cantPlay = ctpPriEvent === CTP_LOADING || ctpPriEvent === CTP_ERROR;
  const handlePause = () => {
    if (ended) {
      dispatch({type: 'watch/media_reply'}) 
    } else {
      dispatch({type: 'watch/onPlayPauseClick'})
    }
  };
  return (
    <WatchCtrlButton
      onClick={handlePause}
      label={paused ? 'Play (k)' : 'Pause (k)'}
      disabled={cantPlay}
      // mouseEnterDelay={600}
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

export const PlayButton = connect(({ watch : { paused, ctpPriEvent }, loading }) => ({
  paused, ctpPriEvent
}))(PlayButtonWithRedux);
