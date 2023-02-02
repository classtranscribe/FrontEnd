import React, {
  // memo,
  // useState,
  // fetch,
  useEffect,
  useCallback,
} from 'react';
import Hls from 'hls.js';
// import { Config } from 'hls.js';
import { isMobile } from 'react-device-detect';
// import axios from 'axios';
// import PlayerWrapper from './PlayerWrapper';
// import { uEvent } from '../../Utils/UserEventController';
import {
  // NORMAL_MODE,
  // PS_MODE,
  // NESTED_MODE /** THEATRE_MODE, */,
  CTP_PLAYING,
  CTP_LOADING,
  CTP_ENDED,
  // CTP_UP_NEXT,
  CTP_ERROR,
  // HIDE_TRANS,
} from '../../Utils/constants.util';
import { api, prompt, _getSelectOptions } from 'utils';
import { createPromptElem } from 'utils/prompt/prompt-creators';

// import { logErrorToAzureAppInsights } from 'utils/logger';

let hls;

const Video = React.memo(
  (props) => {
    const {
      id = 1,
      path,
      dispatch,
      // isSwitched,
      embedded,
      videoRef,
      // openCC,
      // updating,
      captionSpeedUp = 0,
    } = props;

    const _videoRef = React.useRef();
    const isPrimary = id === 1;
    const hlsConfig = {
      // renderTextTracksNatively: false
      // backBufferLength: 30
    };
    const src = path;
    const autoPlay = true;
    // eslint-disable-next-line no-console

    let originalTime = -1;
    let offSet = 0;
    const onDurationChange = useCallback(
      (e) => {
        if (!isPrimary) return;
        let duration = e.target.duration;
        //
        if (e.target.duration !== 0 && e.target.currentTime !== 0 && offSet === 0) {
          offSet = e.target.duration - e.target.currentTime;
          dispatch({ type: 'watch/setOffSet', payload: offSet });
        }
        if (originalTime === -1 && duration !== 0) {
          originalTime = duration;
        }

        // let realTime = duration - originalTime;
        // if (realTime >= 30) {
        //     realTime = 30
        // }

        // if (duration >= 30) {
        //     duration = 30
        // }
        //
        dispatch({ type: 'watch/setDuration', payload: duration - offSet });

        // dispatch({ type: 'watch/setDuration', payload: duration });
        /*
        if (this.state.openRange && !this.state.range) {
            // this.setRange([0, duration]); // TODO
        }
        */
      },
      [isPrimary],
    );
    const setCTPEvent = (event) => {
      dispatch({ type: 'watch/setCTPEvent', payload: { event, priVideo: isPrimary } });
    };
    let prevTime = 0;
    let prevUATime = 0;
    const onTimeUpdate = useCallback(
      ({ target: { currentTime, duration } }) => {
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
          dispatch({ type: 'watch/setCurrCaption' });
        }

        // slow down if caught up at the end
        // const duration = e.target.duration;
        if (Math.abs(duration - currentTime) < 2.0) {
          dispatch({ type: 'watch/media_playbackrate', payload: 1.0 });
        }
      },
      [isPrimary],
    );
    // const onProgress = useCallback((e) => {
    //     if (!isPrimary) return;
    //     const { target: { buffered, currentTime, duration } } = e;
    //     if (duration > 0) {
    //         for (let i = 0; i < buffered.length; i += 1) {
    //             if (buffered.start(buffered.length - 1 - i) < currentTime) {
    //                 dispatch({
    //                     type: 'watch/setBufferedTime', payload: `${(buffered.end(buffered.length - 1 - i) / duration) * 100}%`
    //                 });
    //                 break;
    //             }
    //         }
    //     }
    // }, [isPrimary]);
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
      dispatch({ type: 'watch/onSeekingPri', payload: { seeked: false, priVideo: isPrimary } });
    }, [isPrimary]);
    const onSeekedPri = () => {
      dispatch({ type: 'watch/onSeekingPri', payload: { seeked: true, priVideo: isPrimary } });
    };
    const onErrorPri = () => {
      setCTPEvent(CTP_ERROR);
    };

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
            dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } });
            const liveMode = true;
            dispatch({ type: 'watch/setLiveMode', payload: liveMode });
            console.log(event);
          });
        });
        newHls.on(Hls.Events.MANIFEST_LOADED, (_, event) => {
          console.log(event);
        });
        newHls.on(Hls.Events.ERROR, function (event, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                // try to recover network error
                prompt.error(
                  'Network Error: Please Check your connection/ensure you have the correct link',
                );

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
        // newHls.on(Hls.Events.BUFFER_APPENDED, (_, event) => {
        // const x = event.timeRanges?.video
        //
        // , event.timeRanges.video?.end()
        // })
        // fetch('https://bitdash-a.akamaihd.net/content/sintel/hls/subtitles_de.vtt').then(res =>

        // newHls.on(Hls.Events.MANIFEST_LOADED, (_, _event) => {
        // eslint-disable-next-line no-console
        //
        // if(true) {
        // if(!openCC) {
        //     newHls.subtitleTrack = -1;
        // }

        // eslint-disable-next-line no-console
        //
        // eslint-disable-next-line no-console
        //
        // const transcriptions = event.captions.map(cap => ({id: null, language: cap.lang, src: 'hm'}));
        // eslint-disable-next-line no-console
        //
        // dispatch({type: 'watch/setTranscriptions', payload: transcriptions})
        // dispatch({type: 'watch/setCaptions', payload: [{}]})
        // }
        // });

        // newHls.on(Hls.Events.CUES_PARSED, (_, __) => {
        //     // eslint-disable-next-line no-console
        //     //
        // });

        /*
            newHls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, (_, event) =>{
                
            })
            newHls.on(Hls.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (_, event) =>{
                
            })
            */
        // newHls.on(Hls.Events.CUES_PARSED, (_, __) =>{
        //     //
        // })

        // Hls.Events.MANIFEST_PARSED
        // Hls.Events.NON_NATIVE_TEXT_TRACKS_FOUND and
        // renderTextTracksNatively
        /*
            Hls.Events.SUBTITLE_TRACKS_UPDATED - fired to notify that subtitle track lists has been updated
            data: { subtitleTracks : subtitleTracks }
            Hls.Events.SUBTITLE_TRACK_SWITCH - fired when a subtitle track switch occurs
            data: { id : subtitle track id, type? : playlist type ('SUBTITLES' | 'CLOSED-CAPTIONS'), url? : subtitle track URL }
            Hls.Events.SUBTITLE_TRACK_LOADING - fired when a subtitle track loading starts
            data: { url : audio track URL, id : audio track id }
            Hls.Events.SUBTITLE_TRACK_LOADED - fired when a subtitle track loading finishes
            data: { details : levelDetails object (please see below for more information), id : subtitle track id, stats : [LoadStats] }
            - fired when a subtitle fragment has been processed
            data: { success : boolean, frag : [the processed fragment object], error?: [error parsing subtitles if any] }
            */
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

    //
    let idR = 0;
    let yolo = 0;
    useEffect(() => {
      //
      //
      textTrack = _videoRef.current.textTracks;
      // textTrack.onremovetrack = (e) => {};
      textTrack.onaddtrack = () => {
        if (textTrack === null || textTrack.length === 0) {
          return;
        }
        //
        //

        // const englishTrack = textTrack
        let englishTrack;
        for (var l = 0; l < Array.from(textTrack).length; l++) {
          Array.from(textTrack)[l].mode = 'disabled';
        }
        dispatch({ type: 'watch/setTextTracks', payload: Array.from(textTrack) });

        const possibleEnglishTracks = Array.from(textTrack).filter((track) =>
          track.language.toLowerCase().startsWith('en'),
        );
        if (possibleEnglishTracks.length > 0) {
          englishTrack = possibleEnglishTracks[0];
        } else {
          englishTrack = textTrack[0];
        }
        for (var i = 0; i < Array.from(textTrack).length; i += 1) {
          if (Array.from(textTrack)[i].language === englishTrack.language) {
            dispatch({ type: 'watch/setEnglishTrack', payload: i });
            Array.from(textTrack)[i].mode = 'showing';
          }
        }
        //dispatch({type: "watch/setEnglishTrack", payload: englishTrack});
        //console.log(englishTrack)
        // englishTrack.addEventListener("cuechange", (event) => {

        //     //
        //     const toLog = [];
        //     for (let z = 0; z < event.currentTarget.cues.length; z++) {
        //         let toCopy = JSON.parse(JSON.stringify(event.currentTarget.cues[z]));
        //         toCopy.startTime = event.currentTarget.cues[z].startTime;
        //         toCopy.endTime = event.currentTarget.cues[z].endTime;
        //         toCopy.text = event.currentTarget.cues[z].text;
        //         toLog.push(Object.freeze(toCopy))
        //     }

        //     //

        //     // const prev = undefined;
        //     if (event.currentTarget.activeCues[0] !== undefined) {
        //         idR += 1
        //         let curr = event.currentTarget.activeCues[0];
        //         if (Math.abs(curr.startTime - curr.endTime) > 20) {
        //             curr = event.currentTarget.activeCues[1];
        //         }

        //         let toCopy = JSON.parse(JSON.stringify(curr));
        //         toCopy.startTime = curr.startTime;
        //         toCopy.endTime = curr.endTime;
        //         toCopy.text = curr.text;

        //         if (yolo <= 2) {
        //             // transcript.push(f)
        //             // y
        //             dispatch({ type: 'watch/setTranscript', payload:  toLog})

        //             dispatch({ type: 'watch/setCurrCaption', payload:  Object.freeze( toCopy)})

        //             // splitter(toLog)
        //             yolo = 0
        //         }
        //         yolo += 1;

        //     }
        // })
      };

      if (textTrack[0] !== undefined) {
      }
      console.log(hls.audioTracks);
    }, [_videoRef.current]);

    // If Media Source is supported, use HLS.js to play video
    if (!Hls.isSupported()) return <>Does not support</>;

    // hls.subtitleTracks
    return (
      <div className={embedded ? 'ctp ct-video-con normal' : 'ct-video-contrainer'}>
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
      </div>
    );
  },
  (prevProps, nextProps) => {
    return prevProps.path === nextProps.path && prevProps.isSwitched === nextProps.isSwitched;
  },
);
export default Video;
