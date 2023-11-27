import React, { useCallback } from 'react';

import { isMobile } from 'react-device-detect';
import PlayerWrapper from './PlayerWrapper';
import {
    CTP_PLAYING,
    CTP_LOADING,
    CTP_ENDED,
    CTP_ERROR,
} from '../../Utils/constants.util';

const Video = React.memo((props) => {
    const { id = 1, videoRef, path, dispatch, isSwitched, embedded, videoStyle, playerReady} = props;
    const isPrimary = (id === 1);
    // eslint-disable-next-line no-console
    // console.log('Render - Video', path);
    const onDurationChange = useCallback((e) => {
        if (!isPrimary) return;
        const duration = e.target.duration;
        dispatch({ type: 'watch/setDuration', payload: duration });

        /*
        if (this.state.openRange && !this.state.range) {
            // this.setRange([0, duration]); // TODO
        }
        */
    }, [isPrimary]);
    const setCTPEvent = (event) => {
        dispatch({ type: 'watch/setCTPEvent', payload: { event, priVideo: isPrimary } })
    };
    let prevTime = 0;
    let prevUATime = 0;
    const onTimeUpdate = useCallback(({ target: { currentTime } }) => {
        if (!isPrimary) return;
        // Set current time
        // Throttling
        if (Math.abs(prevTime - currentTime) >= 1) {
            dispatch({ type: 'watch/updateTranscript', payload: currentTime });
            dispatch({ type: 'watch/setTime', payload: currentTime });
            prevTime = currentTime;
        }
        if (Math.abs(prevUATime - currentTime) >= 1) {
            // uEvent.timeupdate(this.currTime());
            dispatch({ type: 'watch/sendMediaHistories' });
            prevUATime = currentTime;
        }
    }, [isPrimary]);
    const onProgress = useCallback((e) => {
        if (!isPrimary) return;
        const { target: { buffered, currentTime, duration } } = e;
        if (duration > 0) {
            for (let i = 0; i < buffered.length; i += 1) {
                if (buffered.start(buffered.length - 1 - i) < currentTime) {
                    dispatch({
                        type: 'watch/setBufferedTime', payload: `${(buffered.end(buffered.length - 1 - i) / duration) * 100}%`
                    });
                    break;
                }
            }
        }
    }, [isPrimary]);
    const onPause = useCallback(() => {
        // if (!isPrimary) return;
        // Pause Handler
    }, [isPrimary]);
    const onCanPlayPri = useCallback(() => {
        dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } })
    }, [isPrimary]);
    const onCanPlayAll = useCallback(() => {
        if(playerReady) {
            // playback rate and other properties should be set after the video has loaded
            playerReady();
        }
        onCanPlayPri();
    });
    
    const onLoadStartPri = useCallback(() => {
        setCTPEvent(CTP_LOADING);
    }, [isPrimary]);
    const onLoadedDataPri = useCallback(() => {
        setCTPEvent(CTP_PLAYING);
    }, [isPrimary]);
    const onWaitingPri = useCallback(() => {
        setCTPEvent(CTP_LOADING);
    }, [isPrimary]);
    const onPlayingPri = useCallback(() => {
        // if (this.PAUSED) this.play();
        setCTPEvent(CTP_PLAYING);
    }, [isPrimary]);
    const onEndedPri = useCallback(() => {
        setCTPEvent(CTP_ENDED);
        dispatch({ type: 'watch/media_pause' });
    }, [isPrimary]);
    const onSeekingPri = useCallback(() => {
        dispatch({ type: 'watch/onSeekingPri', payload: { seeked: false, priVideo: isPrimary } })
    }, [isPrimary]);
    const onSeekedPri = () => {
        dispatch({ type: 'watch/onSeekingPri', payload: { seeked: true, priVideo: isPrimary } })
    }
    const onErrorPri = () => {
        setCTPEvent(CTP_ERROR);
    }

    // const { videoStyle } = getVideoStyle({ClassTranscribePlayer});
    return (<div className={embedded ? "ctp ct-video-con normal" : "ct-video-container"}>
      {embedded ?
            null : <PlayerWrapper isPrimary={isPrimary && !isSwitched || !isPrimary && isSwitched} />}
      <video
        playsInline
        autoPlay={isMobile}
        className="ct-video"
        id={`ct-video-${ id}`}
        ref={videoRef}
        muted={!isPrimary ? true : undefined}
        onDurationChange={onDurationChange}
        onTimeUpdate={onTimeUpdate}
        onProgress={onProgress}
        onPause={onPause}
        onCanPlay={onCanPlayAll}
        onLoadStart={onLoadStartPri}
        onLoadedData={onLoadedDataPri}
        onWaiting={onWaitingPri}
        onPlaying={onPlayingPri}
        onEnded={onEndedPri}
        onSeeking={onSeekingPri}
        onSeeked={onSeekedPri}
        onError={onErrorPri}
        style={videoStyle}
      >
        {path && <source src={path} type="video/mp4" />}
        Your browser does not support video tag.
      </video>
            </div>)
}, (prevProps, nextProps) => prevProps.path === nextProps.path && prevProps.isSwitched === nextProps.isSwitched && prevProps.videoStyle === nextProps.videoStyle);
export default Video;
