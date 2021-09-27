import { isSafari, isIPad13, isIPhone13, isMobile } from 'react-device-detect';
import { api, user, prompt, InvalidDataError, uurl } from 'utils';
import _ from 'lodash';
import { ARRAY_INIT, DEFAULT_ROLE } from 'utils/constants';
import { timeStrToSec, colorMap } from './Utils/helpers';
import PlayerData from './player'
import {
    WEBVTT_SUBTITLES,
    SEARCH_HIDE,
    WEBVTT_DESCRIPTIONS,
    ENGLISH,
    ARRAY_EMPTY,
    // PROFANITY_LIST,
} from './Utils/constants.util';

import { uEvent } from './Utils/UserEventController';
import { promptControl } from './Utils/prompt.control';
import setup from './model/setup'
import player_effects from './model/player_effects'
import menu_effects from './model/menu_effects'
import trans_effects from './model/trans_effects'
import search_effects from './model/search_effects'
import {
    // constants
    MENU_HIDE,
    NORMAL_MODE,
    SEARCH_INIT,
    MODAL_HIDE,
    CTP_LOADING,
    CTP_PLAYING,
    ERR_INVALID_MEDIA_ID,
    ERR_AUTH
    // MODAL_SHARE
} from './Utils';


const initState = {
    // Basics
    userRole: DEFAULT_ROLE,

    error: null,

    // Metadata
    media: {
        id: '',
        mediaName: '',
        createdAt: '',
        isTwoScreen: false,
        videos: [],
        transcriptions: [],
        isUnavailable: false,
    },
    playlist: {},
    playlists: [],
    offering: {},
    watchHistory: [],
    starredOfferings: [],

    // VideoInfo
    time: 0,
    duration: 0,
    bufferedTime: 0,
    isSwitched: false,
    paused: true,

    isFullscreen: false,
    isFullscreenTwo: false,
    ctpPriEvent: CTP_LOADING,
    ctpSecEvent: CTP_LOADING,

    // Trans
    transcriptions: [],
    currTrans: {},
    trackerMap: new Map(),
    transcript: [],
    captions: [],
    currCaption: null,
    descriptions: [],
    currDescription: null,
    currEditing: null,
    bulkEditing: false,
    updating: false,
    currCaptionIndex: 0,
    captionSpeedUp: 0,
    offSet: 0,
    sliderOffSet: 0,
    fontSize: 'normal',
    eventListener: undefined,

    // screen options
    mode: NORMAL_MODE,

    menu: MENU_HIDE,
    modal: MODAL_HIDE,
    liveMode: false,
    englishTrack: undefined,
    currentAudioTrack: 0,
    audioTracks: undefined,

    // Others
    prompt: null,
    search: SEARCH_INIT,
    mouseOnCaption: false,
    embedded: false,
    textTracks: [],
}
/**
* Function used to union two caption arrays
* Merging is based on the { begin, end } of each entry in the arrays
*/
const unionTranscript = (captions, source) => {
    let union = _.concat(
        captions === ARRAY_EMPTY ? [] : captions,
        source === ARRAY_EMPTY ? [] : source,
    );
    // 
    union = _.sortBy(union, (item) => timeStrToSec(item.begin));
    union = _.map(union, (item, index) => ({ ...item, index }));
    return union;
}
function splitter(captionsArray) {
    let toReturn = [];
    let currentSegment = {startTime: captionsArray[1].startTime, endTime:0, text: ""};
    for (let i = 0; i < captionsArray.length; i+= 1){
        if (currentSegment.text.trim().split(" ").length > 5) {
            currentSegment.endTime = captionsArray[i].startTime
            toReturn.push(currentSegment);
            currentSegment = {startTime: captionsArray[i].startTime, endTime:0, text: ""};  
        }
        captionsArray[i].text = captionsArray[i].text.replaceAll("\n", " ");
        captionsArray[i].text = captionsArray[i].text.replaceAll(".", " ");
        captionsArray[i].text = captionsArray[i].text.replaceAll(",", " ");
        captionsArray[i].text = captionsArray[i].text.replaceAll(">>", " ");

        let currentText = captionsArray[i].text;
        // Handle case where toReturn is Empty
        if (toReturn.length === 0) {
            toReturn.push({startTime: captionsArray[0].startTime, endTime: captionsArray[0].endTime, text: captionsArray[0].text});
            i += 1;
        }

        // split indivisual words in the new segment im currently looking at
        let words = currentText.split(" ");
        
        if (words.length === 0 || words.length === 1 && !currentSegment.text.includes(currentText)) {
                currentSegment += (` ${ currentText.trim()}`)
                i +=1;
                currentText = captionsArray[i].text
                words = currentText.split(" ");
        }
        let correctStartFound = words.length - 1;
        
        let prevArray = captionsArray[i - 1].text.split(" ")
        let prevWord = prevArray[prevArray.length - 1]
        let firstWord = prevArray[0]
        if (currentText.includes(prevWord.trim()) && captionsArray[i - 1].text.includes(words[1])) {
            for (let j = words.length - 1; j > 0; j -= 1) {
                // 
                if (words[j].trim() === prevWord.trim() && words[j].trim() !== "") {
                correctStartFound = j + 1
                break
               }
            }
            // 
            
            for (let j = correctStartFound; j < words.length; j+= 1){
                if (words[j].trim() !== ""){
                    currentSegment.text += ` ${ words[j].trim()}`
                }
            }
        } 
        else {
            currentSegment.text += ` ${ currentText.trim()}`
        }
    }
    currentSegment.endTime = captionsArray[captionsArray.length - 1].endTime
    toReturn.push(currentSegment);

    return toReturn;
}

const captionBinarySearch = function (captions, firstStartTime) {
    // return linearSearch(captions, firstStartTime);
    let lo = 0;// Invaruant captions[lo.startTime is always < firstStartTime
    let hi = captions.length ; // inclusive
    // want highest index that is LESS THAN firstStartTime (possibly 0)
    while(true) {
        let mid = Math.floor((lo + hi) / 2);
        if(hi <= lo) { return lo; }
        let v = captions[mid].startTime;
        if (v < firstStartTime) {
            lo = mid + 1;
        } else {
            hi = mid;
        }
    }
}

const linearSearch = function(captions, firstStartTime) {
    let lo = 0;
    let max = captions.length - 1;

    while(true) {
        if (lo >= max || captions[lo].startTime >= firstStartTime) {
            return lo;
        }
        lo += 1;
    }
}
const WatchModel = {
    namespace: 'watch',
    state: { ...initState },
    reducers: {
        // Metadata
        setError(state, { payload }) {
            return { ...state, error: payload };
        },

        setMedia(state, { payload }) {
            return { ...state, media: payload, embedded: false, liveMode: payload.isLive ? 1 : 0 };
        },
        setEmbeddedMedia(state, { payload: { media, ...embeded_payload } }) {
            return {
                ...state, media,
                embedded: embeded_payload,
                liveMode: media.isLive ? 1 : 0
            };
        },
        setLiveMode(state, { payload }) {
            return { ...state, liveMode: payload };
        },
        setTextTracks(state, { payload }) {
            return { ...state, textTracks: payload };
        },

        setAudioTracks(state, { payload }) {
            return { ...state, audioTracks: payload };
        },
        setCurrCaptionIndex(state, { payload }) {
            return { ...state, currCaptionIndex: payload };
        },
        setPlaylist(state, { payload }) {
            return { ...state, playlist: payload };
        },
        setPlaylists(state, { payload }) {
            return { ...state, playlists: payload };
        },
        setOffering(state, { payload }) {
            return { ...state, offering: payload };
        },
        setEventListener(state, { payload }) {
            return { ...state, setEventListener: payload };
        },
        setWatchHistory(state, { payload }) {
            return { ...state, watchHistory: payload };
        },
        setOffSet(state, { payload }) {
            return { ...state, offSet: payload };
        },

        setCaptionSpeedUp(state, { payload }) {
            return { ...state, captionSpeedUp: payload };
        },
        setStarredOfferings(state, { payload }) {
            return { ...state, starredOfferings: payload };
        },
        setEnglishTrack(state, { payload }) {
            if(state.englishTrack !== undefined) {
                // state.englishTrack.mode = 'hidden';
                // state.englishTrack.removeEventListener('cuechange', state.eventListener);
                
            }
            let currTrack = document.getElementsByTagName('video')[0].textTracks;
            
            

            return { ...state, englishTrack: currTrack[payload], transcript: []};
        },

        setFullscreen(state, { payload }) {
            return { ...state, isFullscreen: payload };
        },
        setFullscreenTwo(state, { payload }) {
            return { ...state, isFullscreenTwo: payload };
        },
        // Transcription
        setTranscriptions(state, { payload }) {
            return { ...state, transcriptions: payload };
        },
        setCurrTrans(state, { payload }) {
            return { ...state, currTrans: payload };
        },
        setUpdating(state, { payload }) {
            // 
            return { ...state, updating: payload };
        },

        // Test live caption font size change
        setFontSize(state, { payload }) {
            return { ...state, fontSize: payload };
        },

        // add comments
        // change tracker map with snake type thing



        /**
         * There are four Cases
         * Case one: The Transcript Array is empty. Just copy the entire thing over.
         * Case two: The Transcript Array has things in it. But everything is smaller.
         * Case Three: The Transcript Array has things in it. But everything is bigger.
         * Case Four: The Transcript Array has things to add. But we need to add to the middle.
         */
        setTranscript(state, { payload }) {
            // Todo check that the payload is immutable because we use the subobjects in our immutable model
            let transcript = payload || unionTranscript(state.captions, state.descriptions);
            if (transcript.length === 0) transcript = ARRAY_EMPTY;
            if (! state.liveMode) {
                return { ...state, transcript };
            }
            if(payload.length === 0 ) {
                return state;
            }
            if (state.updating) {
                payload = splitter(payload);
            }
           
            // state.transcript[insertIndex-1].startTime < firstStartTime  (if index>1)
            let checkNearby = 5 // Number of prior captions to check for possible existing entry
            let maxTimeDelta = 30 // to be the same, the existing caption time must be within this number of sceonds

            let result = [...state.transcript]
            // 
            let insertIndex = captionBinarySearch(result, payload[0].startTime);

            for (let payloadIndex = 0; payloadIndex < payload.length; payloadIndex +=1) {
                let caption = payload[payloadIndex];
                if (payloadIndex !== 0 && payload[payloadIndex - 1].startTime !== payload[payloadIndex].startTime) {
                    // TODO: fix the while loop
                    // while (insertIndex + 1 < result.length && caption.startTime >= result[insertIndex].startTime ) {
                    //     insertIndex += 1;
                    // }
                    insertIndex= captionBinarySearch(result, caption.startTime);
                }
                // 
                // 
                // 
                // 
                // Check recent captions that occurred before this time
            
                let doInsert = true
                let checkNumber = Math.min( insertIndex, checkNearby) // in case we dont have enough past items to check
                for( let i = 0; i < checkNumber && doInsert; i += 1 ) {
                    let c = result[insertIndex - 1 -i];

                    doInsert = (c.text !== caption.text || Math.abs(caption.startTime - c.startTime) > maxTimeDelta);
                    if (state.updating) {
                        doInsert = (c.startTime !== caption.startTime)
                    }
                }

                // check the later captions in case we already inserted this
                
                for( let i = insertIndex; doInsert && i < result.length && i < insertIndex + checkNearby ; i += 1 ) {
                    let c = result[i];
                    doInsert = (c.text !== caption.text || Math.abs(caption.startTime - c.startTime) > maxTimeDelta);
                    if (state.updating) {
                        doInsert = (c.startTime !== caption.startTime)
                    }
                }



                // check for length;
                // check for any weird caption scrubbing baloney
                if( doInsert && caption.text?.length > 0 && Math.abs(caption.startTime - caption.endTime) < 30) {
                    result.splice(insertIndex, 0, caption)
                }
            }

            // Handle 608 Captions

            // Todo 708 Captions
            // 
            return { ...state, transcript: result };
        },
        setTranscriptV1(state, { payload }) {
            let transcript = payload || unionTranscript(state.captions, state.descriptions);
            if (transcript.length === 0) transcript = ARRAY_EMPTY;
            if (state.trackerMap.size > 200) {
                state.trackerMap.clear()
            }
            if (state.liveMode) {
                // first and easiest case
                // done with a HashMap for now but we can refine it a bit later
                if (state.transcript.length === 0 || state.transcript === ARRAY_EMPTY) {
                    for (let i = payload.length - 1; i > -1; i-= 1) {
                        if (state.trackerMap.get(payload[i].text) === undefined){
                            state.trackerMap.set(payload[i].text, 0);
                        } else {
                            payload.splice(i, 1)
                        }
                    }
                    // 
                    return { ...state, transcript: payload };
                }
                // next case is if start of payload is less then current end but end is greater than current end
                let startTime = payload[0].startTime;
                let endStart = payload[payload.length - 1].startTime
                // if (payload[payload.length - 1].endTime === state.transcript[state.transcript.length - 1].endTime) {

                // }
                // if (startTime <= state.transcript[state.transcript.length - 1].startTime && endStart >= state.transcript[state.transcript.length - 1].startTime) {
                //     // need to find insertion point
                //     
                //     let left = 0;
                //     let right = payload.length - 1;
                //     let mid = payload.length - 1;
                //     let final = payload.length - 1;
                //     let comparisonTime = state.transcript[state.transcript.length - 1].startTime
                //     
                //     
                //     while (left <= right) {
                //         final = Math.floor((left + right) / 2);

                //         if (payload[final].startTime < comparisonTime) {
                //             left = final + 1;
                //         } else if(payload[final].startTime > comparisonTime) {
                //             right = final - 1;
                //         } else {
                //             
                //             mid = final;
                //             break;
                //         }
                        
                        
                //     }
                    
                //     let toCopyOver = [...state.transcript];

                //     for (let i = mid + 1; i < payload.length; i += 1) {
                //         let hasBeenFound = false;
                //         for (let j = 1; j < 5; j+= 1) {
                //             if (state.transcript.length - j >= 0) {
                                
                //                 if (state.transcript[state.transcript.length - j].text === payload[i].text) {
                //                     hasBeenFound = true;
                //                     break;
                //                 }
                //             }
                //         }

                //         if (!hasBeenFound) {
                //             toCopyOver.push(payload[i]);
                //         }
                //     }

                //     return { ...state, transcript: toCopyOver };


                // }
            } 
            return { ...state, transcript };
        },
        /**
         * Function called for setting captions array
         */
        setCaptions(state, { payload }) {
            let parsedCap = _.map(payload, (c) => ({ ...c, kind: WEBVTT_SUBTITLES }));
            if (parsedCap.length === 0) parsedCap = ARRAY_EMPTY;
            return { ...state, captions: parsedCap };
        },
        setCurrCaption(state, { payload }) {
            if (state.liveMode && state.transcript !== ARRAY_EMPTY) {
                if (!state.updating) {
                    if (state.captionSpeedUp === 0) {
                        return { ...state, currCaption: payload };
                    } 
                        let j = Number(state.time) + Number(state.captionSpeedUp);
                        for (let i = 0; i < state.transcript.length; i+= 1) {
                            if (Number(state.transcript[i].startTime) <= j && Number(state.transcript[i].endTime) >= j) {
                                return { ...state, currCaption: state.transcript[i]};
                            }
                        }
                }
                if (payload !== undefined) {
                for (let i = 0; i < state.transcript.length; i+=1) {
                    if (state.transcript[i].startTime <= payload.startTime + state.captionSpeedUp && state.transcript[i].endTime >= payload.endTime + state.captionSpeedUp) {
                        let z = state.transcript[i];
                        return { ...state, currCaption: z};
                    }
                }
            }
            }
            

            return {...state, currCaption: payload}
        },
        /**
         * * Function called for get or set audio descriptions
        * @todo how??
        */
        setDescriptions(state, { payload }) {
            const parsedDes = _.map(payload, (d) => ({ ...d, kind: WEBVTT_DESCRIPTIONS }));
            return { ...state, descriptions: parsedDes };
        },
        setCurrDescription(state, { payload }) {
            return { ...state, currDescription: payload };
        },
        setCurrEditing(state, { payload }) {
            return { ...state, currEditing: payload };
        },
        setBulkEditing(state, { payload }) {
            return { ...state, bulkEditing: payload };
        },

        // Settings
        setMode(state, { payload }) {
            return { ...state, mode: payload, prevmode: state.mode };
        },
        setMenu(state, { payload }) {
            return { ...state, menu: payload };
        },
        setModal(state, { payload }) {
            return { ...state, modal: payload };
        },

        setTime(state, { payload }) {
            let liveMode = state.liveMode
            if(state.liveMode === 1) {
                liveMode = payload < state.duration - 60 ? 2 : 1
            }
            
            return { ...state, time: payload, liveMode };
        },
        setBufferedTime(state, { payload }) {
            return { ...state, bufferedTime: payload };
        },
        setDuration(state, { payload }) {
            return { ...state, duration: payload };
        },
        switchScreen(state, { payload }) {
            return { ...state, isSwitched: payload };
        },
        setMouseOnCaption(state, { payload }) {
            return { ...state, mouseOnCaption: payload };
        },
        setPause(state, { payload }) {
            return { ...state, paused: payload };
        },
        setCTPEvent(state, { payload: { event = CTP_PLAYING, priVideo = true } }) {
            if (priVideo) {
                return { ...state, ctpPriEvent: event };
            }
            return { ...state, ctpSecEvent: event };
        },
        // Others
        setSearch(state, { payload }) {
            return { ...state, search: { ...state.search, ...payload } };
        },
        resetSearch(state, { payload: status = SEARCH_HIDE }) {
            return {
                ...state, search: {
                    status,
                    value: '',
                    inVideoTransResults: ARRAY_INIT,
                    inCourseTransResults: ARRAY_INIT,
                    playlistResults: ARRAY_INIT,
                }
            }
        },
        setPrompt(state, { payload }) {
            return { ...state, prompt: payload };
        },

        // actions
        setReduxState(state, { payload }) {
            return { ...state, ...payload };
        },

        changeVideo(state, { payload }) {
            return {
                ...state,
                ...payload,
                time: 0,
                duration: 0,
                bufferedTime: 0,
                isFullscreen: false,
                ctpPriEvent: CTP_LOADING,
                ctpSecEvent: CTP_LOADING,
                paused: true,
                isSwitched: false,

                transcriptions: [],
                currTrans: {},
                transcript: [],
                captions: [],
                currCaption: null,
                descriptions: [],
                currDescription: null,
                currEditing: null,
                bulkEditing: false,

                modal: MODAL_HIDE,
                liveMode: false,
                prompt: null,
                search: SEARCH_INIT,
            };
        },

        resetStates(state, { payload }) {
            return { ...initState };
        },
    },
    effects: {
        *setupMedia({ payload }, { call, put, select, take }) {
            // Get media
            yield put.resolve({ type: 'changeVideo', payload: { media: {} } })
            const { id } = uurl.useSearch();
            let media = null;
            try {
                const { data } = yield call(api.getMediaById, id);
                media = api.parseMedia(data);
            } catch (error) {
                if (api.parseError(error).status === 404) {
                    yield put({ type: 'setError', payload: ERR_INVALID_MEDIA_ID });
                } else {
                    yield put({ type: 'setError', payload: ERR_AUTH });
                }
                return null;
            }
            PlayerData.param = {};
            yield put({ type: 'setMedia', payload: media })
            yield put({ type: 'setMenu', payload: MENU_HIDE })
            // Set transcriptions

            const { transcriptions } = media;
            // setTranscriptions
            yield put({ type: 'setTranscriptions', payload: transcriptions })

            // Get Playlist
            const { playlistId } = media;
            const playlist = yield call(setup.getPlaylist, playlistId);
            if (!playlist) {
                promptControl.error('playlist');
                api.contentLoaded();
                return;
            }
            // Set data
            yield put({ type: 'setPlaylist', payload: playlist })

            const { offeringId } = playlist;
            let { data: offering } = yield call(api.getOfferingById, offeringId);
            offering = api.parseSingleOffering(offering);
            yield put({ type: 'setOffering', payload: offering })
            // register the ids to the user event controller
            uEvent.registerIds(media.id, offeringId);
            // send select video event
            uEvent.selectvideo(media.id);

            api.contentLoaded();

            // Get playlists
            const playlists = yield call(setup.getPlaylists, offeringId);
            if (playlists) {
                yield put({ type: 'setPlaylists', payload: playlists })
            }
            if (isSafari && isIPad13 && isIPhone13) {
                promptControl.videoNotLoading();
            }
            try {
                let { data } = yield call(api.getUserWatchHistories)
                yield put({ type: 'setWatchHistories', payload: data.filter(media_ => media_?.id) })
            } catch (error) {
                prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
            }
        },
        *setupEmbeddedMedia({ payload }, { call, put, select, take }) {
            const { mediaId, ...props } = payload;
            let media = payload.media;
            if (!media) {
                if (mediaId) {
                    try {
                        const { data } = yield call(api.getMediaById, mediaId);
                        media = api.parseMedia(data);
                    } catch (error) {
                        if (api.parseError(error).status === 404) {
                            yield put({ type: 'setError', payload: ERR_INVALID_MEDIA_ID });
                        } else {
                            yield put({ type: 'setError', payload: ERR_AUTH });
                        }
                        return false;
                    }
                } else {
                    return false;
                }
            }
            const transcriptions = media.transcriptions;
            delete props.media
            // delete media.transcriptions;
            yield put({ type: 'setEmbeddedMedia', payload: { media, ...props } })
            yield put({ type: 'setTranscriptions', payload: transcriptions })
        },
        ...player_effects,
        ...menu_effects,
        ...trans_effects,
        ...search_effects
    },
    subscriptions: {
        setup({ dispatch, history }) {
            if (!isMobile) {
                // document.removeEventListener('fullscreenchange', this.onFullScreenChange, true);
                document.addEventListener('fullscreenchange', (e) => {
                    dispatch({ type: 'onFullScreenChange', payload: e })
                }, true);
                if (isMobile) {
                    window.addEventListener('orientationchange', () => {
                        // 
                        if ([90, -90].includes(window.orientation)) {
                            /* NOT IMPLEMENTED
                            if (that.currTime() > 0) {
                                that.enterFullScreen();
                            }
                            */
                        }
                    });
                } else {
                    window.addEventListener('resize', () => {
                        if (window.innerWidth < 900) {
                            /* NOT IMPLEMENTED
                            if (that.SCREEN_MODE === PS_MODE) {
                                this.dispatch({ type: 'watch/setWatchMode', payload: { mode: NESTED_MODE, config: { sendUserAction: false } } });
                            }
                            */
                        }
                    });
                }
            }
            history.listen((event) => {
                if (event.pathname === '/video' || event.action === 'PUSH' && event.location.pathname === '/video') {
                    dispatch({ type: 'setupMedia' });
                }
            })
        }
    }
}
export default WatchModel