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
    ctpPriEvent: CTP_LOADING,
    ctpSecEvent: CTP_LOADING,

    // Trans
    transcriptions: [],
    currTrans: {},
    transcript: [],
    captions: [],
    currCaption: null,
    descriptions: [],
    currDescription: null,
    currEditing: null,
    bulkEditing: false,

    // screen options
    mode: NORMAL_MODE,

    menu: MENU_HIDE,
    modal: MODAL_HIDE,

    // Others
    prompt: null,
    search: SEARCH_INIT,
    mouseOnCaption: false,
    embedded: false
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
    // console.error(union)
    union = _.sortBy(union, (item) => timeStrToSec(item.begin));
    union = _.map(union, (item, index) => ({ ...item, index }));
    return union;
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
            return { ...state, media: payload, embedded: false };
        },
        setEmbeddedMedia(state, { payload: { media, ...embeded_payload } }) {
            return {
                ...state, media,
                embedded: embeded_payload
            };
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
        setWatchHistory(state, { payload }) {
            return { ...state, watchHistory: payload };
        },
        setStarredOfferings(state, { payload }) {
            return { ...state, starredOfferings: payload };
        },

        setFullscreen(state, { payload }) {
            return { ...state, isFullscreen: payload };
        },
        // Transcription
        setTranscriptions(state, { payload }) {
            return { ...state, transcriptions: payload };
        },
        setCurrTrans(state, { payload }) {
            return { ...state, currTrans: payload };
        },
        setTranscript(state, { payload }) {
            let transcript = payload || unionTranscript(state.captions, state.descriptions);
            if (transcript.length === 0) transcript = ARRAY_EMPTY;
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
            return { ...state, currCaption: payload };
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
            return { ...state, time: payload };
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
                prompt: null,
                search: SEARCH_INIT,
            };
        },

        resetStates(state, { payload }) {
            return { ...initState };
        },
    },
    effects: {
        *setupMedia({ payload: { embedded = false } }, { call, put, select, take }) {
            // Get media
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
            yield put.resolve({ type: 'changeVideo', payload: media })
            PlayerData.param = {};
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
            yield put({ type: 'setMedia', payload: media })
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
            if(!media) {
                if(mediaId) {
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
                        // console.log('window.orientation', window.orientation)
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