import * as KeyCode from 'keycode-js';
import React, { useEffect } from 'react';
import { connect } from 'dva'
import {
    ErrorWrapper,
    ClassTranscribePlayer,
  } from 'screens/Watch/Components';
import Wrapper from '../Wrapper';
import './index.scss';

const Player = function(props) {
  const { media, beginAt, allowScreenshot, mediaId, error, screenshotActionElement, dispatch, isFullscreen } = props;
  const onKeyDown = (event) => {
    const { keyCode,
      //* metaKey
    } = event;
    switch (keyCode) {
      // k or space - pause/play
      case KeyCode.KEY_K:
      case KeyCode.KEY_SPACE:
        event.preventDefault();
        dispatch({ type: 'watch/onPlayPauseClick' });
        return;
      // m - mute/unmute
      case KeyCode.KEY_M:
        event.preventDefault();
        dispatch({ type: 'watch/media_mute' });
        return;
      // left arrow - rewind
      case KeyCode.KEY_LEFT:
        event.preventDefault();
        dispatch({ type: 'watch/media_backward' });
        return;
      // right arrow - forward
      case KeyCode.KEY_RIGHT:
        event.preventDefault();
        dispatch({ type: 'watch/media_forward' });
        return;

      // top arrow - forward
      case KeyCode.KEY_UP:
        event.preventDefault();
        // player.volumeUp();
        return;

      // bottom arrow - forward
      case KeyCode.KEY_DOWN:
        event.preventDefault();
        // player.volumeDown();
        break;

      default:
    }
  };
  // watch, setMedia
  useEffect(() => {
    dispatch({
      type: 'watch/setupEmbeddedMedia', payload: {
        media, beginAt, mediaId,
        allowScreenshot
      }
    });
  }, [media]);

  if (error) {
    return <ErrorWrapper error={error} />;
  }
  if (isFullscreen) {
    return (
      <div
        className="ctp ct-player-con-fullscreen"
        onKeyDown={onKeyDown}
        tabIndex="0"
      >
        <div
          className="ctp ct-player lg fill"
        >
          <ClassTranscribePlayer />
          <Wrapper screenshotActionElement={screenshotActionElement} />
        </div>
      </div>
    );
  }
  return (
    <div
      className="ctp ct-player-con"
      onKeyDown={onKeyDown}
      tabIndex="0"
      style={{ height: '100%', width: '100%' }}
    >
      <div
        className="ctp ct-player lg fill"
      >
        <ClassTranscribePlayer />
        <Wrapper screenshotActionElement={screenshotActionElement} />
      </div>
    </div>
  );
}
export default connect(({
    watch: { error, isFullscreen }
})=>({
    error, isFullscreen
}))(Player);
