import React, { memo, useState, useEffect, useCallback, fetch } from 'react';
import Hls, { Config } from 'hls.js';
import { isMobile } from 'react-device-detect';
import axios from 'axios';
import PlayerWrapper from './PlayerWrapper';
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
import { logErrorToAzureAppInsights } from 'utils/logger';

let hls;

const Video = React.memo((props) => {
    const { id = 1, path, dispatch, isSwitched, embedded, videoRef, openCC, updating } = props;
    const _videoRef = React.useRef();
    const isPrimary = (id == 1);
    const hlsConfig = {
        // renderTextTracksNatively: false
    }
    const src = path;
    const autoPlay = true;
    // eslint-disable-next-line no-console
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
                newHls.on(Hls.Events.MANIFEST_PARSED, () => {
                    dispatch({ type: 'watch/onPlayerReady', payload: { isPrimary } })
                    const liveMode = true
                    dispatch({ type: 'watch/setLiveMode', payload:  liveMode })
                });
            });
            newHls.on(Hls.Events.BUFFER_APPENDED, (_, event) => {
                const x = event.timeRanges?.video
                // console.log(x.length > 0 ? x.end(0) : "XX")
                // , event.timeRanges.video?.end()
            })
            // fetch('https://bitdash-a.akamaihd.net/content/sintel/hls/subtitles_de.vtt').then(res => console.log(res))

            newHls.on(Hls.Events.MANIFEST_LOADED, (_, event) => {
                // eslint-disable-next-line no-console
                console.log(event)
                if(true) {
                    // if(!openCC) {
                    //     newHls.subtitleTrack = -1;
                    // }

                    // eslint-disable-next-line no-console
                    console.log(newHls.captionsTextTrack1Label)
                    // eslint-disable-next-line no-console
                    console.log("hmmm")
                    const transcriptions = event.captions.map(cap => ({id: null, language: cap.lang, src: 'hm'}))
                    // eslint-disable-next-line no-console
                    console.log(transcriptions)
                    // dispatch({type: 'watch/setTranscriptions', payload: transcriptions})
                    // dispatch({type: 'watch/setCaptions', payload: [{}]})
                }
            })

            newHls.on(Hls.Events.CUES_PARSED, (_, event) => {
                // eslint-disable-next-line no-console
                console.log(event)
            })

            newHls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, (_, event) => {
                const baseUrl = event.frag.baseurl
                console.log(baseUrl)
                let splitted = baseUrl.split("/")
                let processed = "";
                for (let i = 0; i < splitted.length - 1; i++) {
                    processed += splitted[i] + "/";
                  }
                console.log(processed)
                processed += event.frag.relurl
                console.log(processed)


                axios.get(processed).then(function(input) {
                    // var text = input.data
                    // //console.log(text)
                    // var initial = text.split("\n\n")
                    // var post = initial.splice(1, initial.length)
                    // for (var i = 0; i < post.length; i++) {
                    //     var anotherIntermediary = post[i].split("\n\n")
                    //     var bruh = anotherIntermediary[0].split("\n")

                    
                    //     var toDispatch = {start: null, end: null, text: null}

                    //     var times = bruh[1].split(" ")

                    //     if (times[0].length > 0) {
                    //         toDispatch.start = times[0]
                    //         toDispatch.end = times[2]
                            
                    //         var parsedText = ""
                    //         for (var almostDone = 2; almostDone < bruh.length; almostDone++) {
                    //             parsedText += bruh[almostDone].trim() + " "
                    //         }
                    //         parsedText.trim()

                    //         toDispatch.text = parsedText.trim()
                    //         // var currentDate = newHls.media.currentTime + newHls.levels[0].details.programDateTime - newHls.levels.details.fragments[0].start;
                    //         // currentDate = hls.media.currentTime + hls.level.details.fragments[0].programDateTime - level.details.fragments[0].start;

                    //         dispatch({type: 'watch/setTranscript', payload: [{id: null, language: 'en', src: 'WEBVTT', text: toDispatch.text}]})

                    //         dispatch({type: 'watch/setCaptions', payload: [toDispatch.text]})
                    //         console.log(newHls.levels[0])

                        // }
                    // }
                })



                console.log(event);
                newHls.renderTextTracksNatively = true;

            })

           
            /*
            newHls.on(Hls.Events.SUBTITLE_FRAG_PROCESSED, (_, event) =>{
                console.log(_, event)
            })
            newHls.on(Hls.Events.NON_NATIVE_TEXT_TRACKS_FOUND, (_, event) =>{
                console.log(_, event)
            })
            */
            newHls.on(Hls.Events.CUES_PARSED, (_, event) =>{
                console.log(_, event)
            })
            
            
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

    function splitter(captionsArray) {
        let toReturn = [];
        let currentSegment = {beginTime: captionsArray[1].startTime, endTime:0, text: ""};
        for (let i = 0; i < captionsArray.length; i++){
            if (currentSegment.text.trim().split(" ").length > 5) {
                currentSegment.endTime = captionsArray[i].startTime
                toReturn.push(currentSegment);
                currentSegment = {beginTime: captionsArray[i].startTime, endTime:0, text: ""};
                console.log("yooo")
                
            }
            captionsArray[i].text = captionsArray[i].text.replaceAll("\n", " ");
            captionsArray[i].text = captionsArray[i].text.replaceAll(".", " ");
    
            let currentText = captionsArray[i].text;
            // Handle case where toReturn is Empty
            if (toReturn.length == 0) {
                toReturn.push({beginTime: captionsArray[0].startTime, endTime: captionsArray[0].endTime, text: captionsArray[0].text});
                continue;
            }
    
            // split indivisual words in the new segment im currently looking at
            let words = currentText.split(" ");
            
            // if (words.length == 0 || words.length == 1) {
            //     if (currentSegment.includes(currentText)) {
            //         continue;
            //     } else {
            //         currentSegment = currentSegment += (` ${ currentText.trim()}`)
            //         continue;
            //     }
            // }
            let correctStartFound = words.length - 1;
            
            let prevArray = captionsArray[i - 1].text.split(" ")
            let prevWord = prevArray[prevArray.length - 1]
            let firstWord = prevArray[0]
            if (currentText.includes(prevWord.trim())) {
                for (let j = words.length - 1; j > 0; j -= 1) {
                    //console.log(words)
                    if (words[j].trim() === prevWord.trim() && words[j].trim() != "") {
                    correctStartFound = j + 1
                    break
                   }
                }
                //console.log(correctStartFound)
                
                for (let j = correctStartFound; j < words.length; j+= 1){
                    if (words[j].trim() != ""){
                        currentSegment.text += " "  + words[j].trim()
                    }
                }
            } else if(firstWord == words[0]) {
                continue;
            }else {
                console.log("causing problems")
                currentSegment.text += " " + currentText.trim()
            }
        }
        currentSegment.endTime = captionsArray[captionsArray.length - 1].endTime
        toReturn.push(currentSegment);
        console.log(toReturn)
        console.log(captionsArray)
        return toReturn;
    }
    var textTrack = undefined;

    console.log(_videoRef)
    let transcript = []
    let idR = 0;
    let yolo = 0;
    useEffect(() => {
        console.log("plz")
        console.log(_videoRef)
        textTrack = _videoRef.current.textTracks
        textTrack.onaddtrack = () => {
            if (textTrack === null || textTrack.length === 0) {
                return;
            }
            console.log('ch has loaded');
            console.log(textTrack)

            // const englishTrack = textTrack
            let englishTrack;
            const possibleEnglishTracks = Array.from(textTrack).filter(track => track.language.toLowerCase().startsWith("en"));
            if (possibleEnglishTracks.length > 0) {
                englishTrack = possibleEnglishTracks[0];
            } else {
                englishTrack = textTrack[0];
            }
            englishTrack.addEventListener("cuechange", (event) => {
                
                // console.log(event);
                var toLog = [];
                for (let z = 0; z < event.currentTarget.cues.length; z++) {
                    toLog.push(event.currentTarget.cues[z])
                }

                // console.log(toLog)
                var l = event.currentTarget.activeCues[0]
                var prev = undefined
                if (l != undefined) {
                    idR += 1


                    
                    
                    var f = {id: event.currentTarget.activeCues[0].id, 
                    startTime: event.currentTarget.activeCues[0].startTime,
                    endTime: event.currentTarget.activeCues[0].endTime, 
                    text: event.currentTarget.activeCues[0].text}


                    if (yolo <= 2) {
                        //transcript.push(f)
                        //console.log(transcript)y
                        dispatch({ type: 'watch/setTranscript', payload:  toLog  })

                        
                        dispatch({ type: 'watch/setCurrCaption', payload:  f  })
                        
                        //splitter(toLog)
                        yolo = 0
                    }
                    yolo += 1
                    

                    
                }
            })
          };
        console.log(textTrack)
        if (textTrack[0] !== undefined) {
            console.log('okokok')
        }
      }, [_videoRef.current])


    // If Media Source is supported, use HLS.js to play video
    if (!Hls.isSupported()) return <>Does not support</>

    // hls.subtitleTracks
    return (
      <div className={embedded ? "ctp ct-video-con normal" : "ct-video-contrainer"}>
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
    return prevProps.path === nextProps.path 
    && prevProps.isSwitched === nextProps.isSwitched
});
export default Video;