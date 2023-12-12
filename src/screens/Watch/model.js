/* eslint-disable no-console */
import { isSafari, isIPad13, isIPhone13, isMobile } from 'react-device-detect';
import { api, prompt, uurl } from 'utils';
import _ from 'lodash';
import { ARRAY_INIT, DEFAULT_ROLE } from 'utils/constants';
import { timeStrToSec } from './Utils/helpers';
import PlayerData from './player'
import {
    WEBVTT_SUBTITLES,
    SEARCH_HIDE,
    WEBVTT_DESCRIPTIONS,
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
        hasASL: false,
        videos: [],
        transcriptions: [],
        isUnavailable: false,
        flashDetected: false
    },
    flashAcknowledged: false,
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
// const unionTranscript = (captions, source) => {
//     let union = _.concat(
//         captions === ARRAY_EMPTY ? [] : captions,
//         source === ARRAY_EMPTY ? [] : source,
//     );
//     // 
//     union = _.sortBy(union, (item) => timeStrToSec(item.begin));
//     union = _.map(union, (item, index) => ({ ...item, index }));
//     return union;
// }

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
        // setCurrTrans(state, { payload }) {
        //    return { ...state, currTrans: payload };
        // },
        setCurrentTranscriptionMulti(state, { payload }) {
            const { halfKey, active } = payload;
            let { currentTranscriptionMulti = {halfKeysSelected:[] } } = state;
            let newKeys = currentTranscriptionMulti.halfKeysSelected.filter(i => (i !== halfKey))
            if( active ) {
                newKeys.push(halfKey)
            }
            return { ...state, currentTranscriptionMulti: {halfKeysSelected: newKeys} };
        },
        setUpdating(state, { payload }) {
            // 
            return { ...state, updating: payload };
        },

        // Test live caption font size change
        setFontSize(state, { payload }) {
            return { ...state, fontSize: payload };
        },

        // setup the transcript UI model; the caption and description data must already be loaded
        // eslint-disable-next-line no-unused-vars
        setTranscript(state, _unused) {
            // Todo check that the payload is immutable because we use the subobjects in our immutable model
            console.log("setTranscript")          
            let all = [... state.captions,...state.descriptions]

            let transcript = all;
            // Using String sort so numbers (1.123 21.0) must be right aligned with same number of decimal places 
            // Put Closed Captions after Descriptions
            transcript = _.sortBy(transcript, (item) => `${timeStrToSec(item.begin).toFixed(2).padStart(10)}/${item.tran.transcriptionType === 0?'Z':item.tran.transcriptionType}`);
            transcript= _.map(transcript, (item, index) => ({ ...item, index }));
            
            if (transcript.length === 0) transcript = ARRAY_EMPTY;
            
            return { ...state, transcript };
            }
        ,
        /** 
         * Function called for setting captions array
         */
        setCaptions(state, { payload }) {
            console.log(`setCaptions ${payload.length}`)
            let parsedCap = _.map(payload, (c) => ({ ...c, kind: WEBVTT_SUBTITLES }));
            if (parsedCap.length === 0) parsedCap = ARRAY_EMPTY;
            return { ...state, captions: parsedCap };
        },
        setCurrCaption(state, { payload }) {
            return {...state, currCaption: payload}
        },
        /**
         * * Function called for get or set audio descriptions
        * 
        */
        setDescriptions(state, { payload }) {
            console.log(`setDescriptions ${payload.length}`)
            if(payload.length>0) {
                console.log(`First description: ${payload[0]}`)
            }
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


        setFlashAcknowledged(state, { payload }) {
            return { ...state, flashAcknowledged: payload };
        },

        changeVideo(state, { payload }) {
            return {
                ...state,
                ...payload,
                time: 0,
                duration: 0,
                bufferedTime: 0,
                isFullscreen: false,
                hasASL: false,
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
                flashAcknowledged: false,
            };
        },

        // eslint-disable-next-line no-unused-vars
        resetStates(_state, { _unused }) {
            return { ...initState };
        },
    },
    effects: {
        *setupMedia(_unused, { call, put }) {
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
            // console.log('-----');
            console.log(`*setupMedia ${transcriptions.length} transcriptions`);

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
        *setupEmbeddedMedia({ payload }, { call, put }) {
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