import { ARRAY_INIT, DEFAULT_ROLE } from 'utils/constants';
import { isMobile } from 'react-device-detect';
import _ from 'lodash';
import { isSafari, isIPad13, isIPhone13 } from 'react-device-detect';
import { api, user, prompt, InvalidDataError, uurl } from 'utils';
import { uEvent } from './Utils/UserEventController';
import { ERR_INVALID_MEDIA_ID, ERR_AUTH, ENGLISH, ARRAY_EMPTY, HIDE_TRANS } from './Utils/constants.util';
import { promptControl } from './Utils/prompt.control';
import setup from './model/setup'
import player_effects from './model/player_effects'
import menu_effects from './model/menu_effects'
import {
    preferControl,
    // constants
    MENU_HIDE,
    NORMAL_MODE,
    SEARCH_INIT,
    MODAL_HIDE,
    CTP_LOADING,
    CTP_PLAYING,
    // MODAL_SHARE
} from './Utils';
const initState = {
    // Basics
    userRole: DEFAULT_ROLE,

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
    playbackrate: preferControl.defaultPlaybackRate(),

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
    openCC: preferControl.cc(),
    openAD: preferControl.ad(),

    // screen options
    mode: NORMAL_MODE,
    transView: preferControl.defaultTransView(),
    menu: MENU_HIDE,
    modal: MODAL_HIDE,

    // Others
    prompt: null,
    search: SEARCH_INIT,
}
const WatchModel = {
    namespace: 'watch',
    state: { ...initState },
    reducers: {
        // Metadata
        setMedia(state, { payload }) {
            return { ...state, media: payload };
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

        // Transcription
        setTranscriptions(state, { payload }) {
            return { ...state, transcriptions: payload };
        },
        setCurrTrans(state, { payload }) {
            return { ...state, currTrans: payload };
        },
        setTranscript(state, { payload }) {
            return { ...state, transcript: payload };
        },
        setCaptions(state, { payload }) {
            return { ...state, captions: payload };
        },
        setCurrCaption(state, { payload }) {
            return { ...state, currCaption: payload };
        },
        setDescriptions(state, { payload }) {
            return { ...state, descriptions: payload };
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
        setOpenCC(state, { payload }) {
            return { ...state, openCC: payload };
        },
        setOpenAD(state, { payload }) {
            return { ...state, openAD: payload };
        },

        // Settings
        setMode(state, { payload }) {
            return { ...state, mode: payload };
        },
        setTransView(state, { payload }) {
            return { ...state, transView: payload };
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
        setPlaybackrate(state, { payload }) {
            return { ...state, playbackrate: payload };
        },
        setPause(state, { payload }) {
            return { ...state, paused: payload };
        },
        setCTPEvent(state, { event = CTP_PLAYING, priVideo = true }) {
            if (priVideo) {
                return { ...state, ctpPriEvent: event };
            } else {
                return { ...state, ctpSecEvent: event };
            }
        },
        // Others
        setSearch(state, { payload }) {
            return { ...state, search: payload };
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
        timeUpdate(state, { payload }) {
            return { ...state, time: payload[0], currCaption: payload[1] }
        },
    },
    effects: {
        *setTranscriptions({ trans }, { call, put, select, take }) {
            const currTrans = _.find(trans, { ENGLISH }); // trans.find(tran => tran.language === 'en-US')
            uEvent.registerLanguage(ENGLISH);
            if (currTrans) {
                // this.currTrans(currTrans);
            } else {
                // this.transcript(ARRAY_EMPTY);
                if (!isMobile) {
                    // this.transView(HIDE_TRANS, { updatePrefer: false });
                }
            }
        },
        *setupMedia({ payload }, { call, put, select, take }) {
            // Get media
            const { id } = uurl.useSearch();
            let media = null;
            try {
                const { data } = yield call(api.getMediaById, id);
                media = api.parseMedia(data);
            } catch (error) {
                if (api.parseError(error).status === 404) {
                    // setError(ERR_INVALID_MEDIA_ID);
                } else {
                    // setError(ERR_AUTH);
                }
                return null;
            }
            yield put({ type: 'changeVideo', payload: media })

            // videoControl.clear();
            // transControl.clear();
            yield put({ type: 'setMenu', payload: MENU_HIDE })
            // Set transcriptions

            const { transcriptions } = media;
            // setTranscriptions
            yield put({ type: 'setTranscriptions', payload: transcriptions })
            // transControl.transcriptions(transcriptions);

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
                // yield put({ type: 'setWatchHistories', payload: data.filter(media => media && media.id) })
            } catch (error) {
                prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
            }
        },
        ...player_effects,
        ...menu_effects
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                if (event.pathname === '/video' || event.action === 'PUSH' && event.location.pathname === '/video') {
                    dispatch({ type: 'setupMedia' });
                }
            })
        }
    }
}
export default WatchModel