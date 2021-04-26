import React, { memo, useState, useEffect, useCallback } from 'react';
import Hls, { Config } from 'hls.js';
import PlayerWrapper from './PlayerWrapper';
import { isMobile } from 'react-device-detect';
import { uEvent } from '../../Utils/UserEventController';
import {
    NORMAL_MODE,
    PS_MODE,
    NESTED_MODE /** THEATRE_MODE, */,
    CTP_PLAYING,
    CTP_LOADING,
    CTP_ENDED,
    CTP_UP_NEXT,
    CTP_ERROR,
    HIDE_TRANS,
} from '../../Utils/constants.util';

const Video = React.memo((props) => {
    const { id = 1, path, dispatch, isSwitched, embedded, videoRef } = props;
    const _videoRef = React.useRef();
    const isPrimary = (id == 1);
    const hlsConfig = {}
    const src = path;
    const autoPlay = true;
    console.log('Render - Video HLS Player', path);

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
        if (!isPrimary) return;
        // Pause Handler
    }, [isPrimary]);
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

    useEffect(() => {
        let hls;

        function _initPlayer() {
            if (hls != null) {
                hls.destroy();
            }

            const newHls = new Hls({
                enableWorker: false,
                ...hlsConfig,
            });
            if (_videoRef.current != null) {
                // set
                videoRef(_videoRef.current);
                newHls.attachMedia(_videoRef.current);
            }

            newHls.on(Hls.Events.MEDIA_ATTACHED, () => {
                newHls.loadSource(src);
                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } })
                });
            });
            newHls.on(Hls.Events.BUFFER_APPENDED, (_, event)=> {
                const x = event.timeRanges?.video
                console.log(x.length > 0 ? x.end(0): "XX")
                // , event.timeRanges.video?.end()
            })
            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            newHls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            newHls.recoverMediaError();
                            break;
                        default:
                            _initPlayer();
                            break;
                    }
                }
            });

            hls = newHls;
        }

        // Check for Media Source support
        if (Hls.isSupported()) {
            _initPlayer();
        }

        return () => {
            if (hls != null) {
                hls.destroy();
            }
        };
    }, [autoPlay, hlsConfig, _videoRef, src]);

    // If Media Source is supported, use HLS.js to play video
    if (!Hls.isSupported()) return <>Does not support</>

    return (<div className={embedded ? "ctp ct-video-con normal" : "ct-video-contrainer"}>
        {embedded ?
            null : <PlayerWrapper isPrimary={isPrimary && !isSwitched || !isPrimary && isSwitched} />
        }
        <video
            playsInline
            autoPlay={isMobile}
            className="ct-video"
            id={"ct-video-" + id}
            ref={_videoRef}
            muted={!isPrimary ? true : undefined}
            onDurationChange={onDurationChange}
            onTimeUpdate={onTimeUpdate}
            onPause={onPause}
            onLoadStart={onLoadStartPri}
            onLoadedData={onLoadedDataPri}
            onWaiting={onWaitingPri}
            onPlaying={onPlayingPri}
            onEnded={onEndedPri}
            onSeeking={onSeekingPri}
            onSeeked={onSeekedPri}
            onError={onErrorPri}
        >
            Your browser does not support video tag.
    </video>
    </div>)
}, (prevProps, nextProps) => {
    return prevProps.path === nextProps.path && prevProps.isSwitched === nextProps.isSwitched;
});
export default Video;