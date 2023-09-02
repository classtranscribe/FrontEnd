/* eslint-disable no-console */
import React, {
    useEffect, useCallback
} from 'react';
import Hls from 'hls.js';
import { isMobile } from 'react-device-detect';
import { prompt } from 'utils';
import {
    CTP_PLAYING,
    CTP_LOADING,
    CTP_ENDED,
    CTP_ERROR,
} from '../../Utils/constants.util';


let hls;

const Video = React.memo((props) => {
    const {
        id = 1,
        path,
        dispatch,
        embedded,
        videoRef,
        captionSpeedUp = 0,
    } = props;

    const _videoRef = React.useRef();
    const isPrimary = (id === 1);
    const hlsConfig = {
        // renderTextTracksNatively: false
        // backBufferLength: 30
    }
    const src = path;
    const autoPlay = true;
    // eslint-disable-next-line no-console

    let originalTime = -1;
    let offSet = 0
    const onDurationChange = useCallback((e) => {
        if (!isPrimary) return;
        let duration = e.target.duration;
        // 
        if (e.target.duration !== 0 && e.target.currentTime !== 0 && offSet === 0) {
            offSet = (e.target.duration - e.target.currentTime);
            dispatch({ type: "watch/setOffSet", payload: offSet })
        }
        if (originalTime === -1 && duration !== 0) {
            originalTime = duration;
        }

        dispatch({ type: 'watch/setDuration', payload: (duration - offSet) });
    }, [isPrimary]);
    const setCTPEvent = (event) => {
        dispatch({ type: 'watch/setCTPEvent', payload: { event, priVideo: isPrimary } })
    };
    let prevTime = 0;
    let prevUATime = 0;
    const onTimeUpdate = useCallback(({ target: { currentTime, duration } }) => {
        if (!isPrimary) return;
        // Set current time
        // Throttling
        if (Math.abs(prevTime - currentTime) >= 1) {
            dispatch({ type: 'watch/updateTranscript', payload: currentTime });
            dispatch({ type: 'watch/setTime', payload: currentTime });
            prevTime = currentTime;
        }
        // integer value

        if (Math.abs(prevUATime - currentTime) >= 1) {
            // uEvent.timeupdate(this.currTime());
            dispatch({ type: 'watch/sendMediaHistories' });
            prevUATime = currentTime;
        }
        // 
        if (captionSpeedUp !== 0) {
            dispatch({ type: 'watch/setCurrCaption' })
        }

        // slow down if caught up at the end
        // const duration = e.target.duration;
        if (Math.abs(duration - currentTime) < 2.0) {
            dispatch({ type: 'watch/media_playbackrate', payload: 1.0 })
        }
    }, [isPrimary]);
    const onPause = useCallback(() => {
        // eslint-disable-next-line no-useless-return
        if (!isPrimary) return;
        // Pause Handler
    }, [isPrimary]);
    const onLoadStartPri = useCallback(() => {
        setCTPEvent(CTP_LOADING);
    }, [isPrimary]);
    const onLoadedDataPri = useCallback(() => {
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
                newHls.on(Hls.Events.MANIFEST_PARSED, (_, event) => {
                    dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } })
                    const liveMode = true
                    dispatch({ type: 'watch/setLiveMode', payload: liveMode })
                    console.log(event)
                });
            });
            newHls.on(Hls.Events.MANIFEST_LOADED, (_, event) => {
                console.log(event)
            });
            newHls.on(Hls.Events.ERROR, function (event, data) {
                if (data.fatal) {
                    switch (data.type) {
                        case Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            prompt.error('Network Error: Please Check your connection/ensure you have the correct link');

                            console.log('fatal network error encountered, try to recover');

                            hls.startLoad();
                            break;
                        case Hls.ErrorTypes.MEDIA_ERROR:
                            prompt.error('Media Error: Where working on getting things back online!');

                            console.log('fatal media error encountered, try to recover');
                            hls.recoverMediaError();
                            break;
                        default:
                            // cannot recover
                            hls.destroy();
                            break;
                    }
                }
            });
        
            newHls.on(Hls.Events.ERROR, (_event, data) => {
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
            window.hls = newHls;
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


    let textTrack;

   
    useEffect(() => {
        // 
        // 
        textTrack = _videoRef.current.textTracks
        // textTrack.onremovetrack = (e) => {};
        textTrack.onaddtrack = () => {
            if (textTrack === null || textTrack.length === 0) {
                return;
            }
            // 
            // 

            // const englishTrack = textTrack
            let englishTrack;
            for (let l = 0; l < Array.from(textTrack).length; l += 1) {
                Array.from(textTrack)[l].mode = 'disabled';
            }
            dispatch({ type: 'watch/setTextTracks', payload: Array.from(textTrack) });

            const possibleEnglishTracks = Array.from(textTrack).filter(track => track.language.toLowerCase().startsWith("en"));
            if (possibleEnglishTracks.length > 0) {
                englishTrack = possibleEnglishTracks[0];
            } else {
                englishTrack = textTrack[0];
            }
            for (let i = 0; i < Array.from(textTrack).length; i += 1) {
                if (Array.from(textTrack)[i].language === englishTrack.language) {
                    dispatch({ type: "watch/setEnglishTrack", payload: i });
                    Array.from(textTrack)[i].mode = "showing";
                }
            }
        };
        console.log(hls.audioTracks);
    }, [_videoRef.current])



    // If Media Source is supported, use HLS.js to play video
    if (!Hls.isSupported()) return <>Does not support</>

    // hls.subtitleTracks
    return (
      <div className={embedded ? "ctp ct-video-con normal" : "ct-video-container"}>
        {/* {embedded ?
            null : <PlayerWrapper isPrimary={isPrimary && !isSwitched || !isPrimary && isSwitched} />
        } */}
        <video
          playsInline
          autoPlay={isMobile}
          className="ct-video"
          id={`ct-video-${id}`}
          ref={_videoRef}
          muted={!isPrimary ? true : undefined}
          onDurationChange={onDurationChange}
          onTimeUpdate={onTimeUpdate}
          onPause={onPause}
          onLoadStart={onLoadStartPri}
          onLoadedData={onLoadedDataPri}
          onEnded={onEndedPri}
          onSeeking={onSeekingPri}
          onSeeked={onSeekedPri}
          onError={onErrorPri}
        >
          Your browser does not support video tag.
        </video>
      </div>)
}, (prevProps, nextProps) => {
    return prevProps.path === nextProps.path
        && prevProps.videoPlaying === nextProps.videoPlaying
});
export default Video;
