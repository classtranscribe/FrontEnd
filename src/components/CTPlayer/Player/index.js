import React, { useEffect } from 'react';
import { connect } from 'dva'
import {
    ErrorWrapper,
    ClassTranscribePlayer,
  } from 'screens/Watch/Components';
import Wrapper from '../Wrapper';
import './index.scss';

function Player(props) {
    const { media, beginAt, allowScreenshot,
        mediaId,
        error,
        screenshotActionElement,
        dispatch } = props
    const onKeyDown = (event) => {
        const { keyCode,
            //* metaKey 
        } = event;
        switch (keyCode) {
            // k or space - pause/play
            case 75:
            case 32:
                event.preventDefault();
                dispatch({ type: 'watch/onPlayPauseClick' })
                return;
            // m - mute/unmute
            case 77:
                event.preventDefault();
                dispatch({ type: 'watch/media_mute' })
                return;
            // left arrow - rewind
            case 37:
                event.preventDefault();
                dispatch({ type: 'watch/media_backward' })
                return;
            // right arrow - forward
            case 39:
                event.preventDefault();
                dispatch({ type: 'watch/media_forward' })
                return;

            // top arrow - forward
            case 38:
                event.preventDefault();
                // player.volumeUp();
                return;

            // bottom arrow - forward
            case 40:
                event.preventDefault();
                // player.volumeDown();
                break;

            default:
        }
    }
    // watch, setMedia
    useEffect(() => {
        dispatch({
            type: 'watch/setupEmbeddedMedia', payload: {
                media, beginAt, mediaId,
                allowScreenshot
            }
        })
    }, [media])
    if(error) {
        return <ErrorWrapper error={error} />;
    }
    return (
      <div
        className="ctp ct-player-con"
        onKeyDown={onKeyDown}
        tabIndex="0"
        style={{
                width: '100%',
                height: '100%'
            }}
      >
        <div
          className="ctp ct-player lg fill"
          style={{
                    width: '100%',
                    height: '100%'
                }}
        >
          <ClassTranscribePlayer />
          <Wrapper screenshotActionElement={screenshotActionElement} />
        </div>
      </div>
        );
}
export default connect(({
    watch: { error }
})=>({
    error
}))(Player);