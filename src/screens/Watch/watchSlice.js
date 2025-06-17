import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isSafari, isIPad13, isIPhone13, isMobile } from 'react-device-detect';
import { api, prompt, uurl } from 'utils';
import _ from 'lodash';
import { ARRAY_INIT, DEFAULT_ROLE } from 'utils/constants';
import { addInitializer, addSubscription } from 'model/listener';
import { timeStrToSec } from './Utils/helpers';
import PlayerData from './player';
import {
  WEBVTT_SUBTITLES,
  SEARCH_HIDE,
  WEBVTT_DESCRIPTIONS,
  ARRAY_EMPTY,
} from './Utils/constants.util';
import { uEvent } from './Utils/UserEventController';
import { promptControl } from './Utils/prompt.control';
import setup from './model/setup';
import playerEffects from './model/playerEffects';
import './model/menuThunks'
import './model/transThunks'
import './model/searchThunks'
// import menu_effects from './model/menu_effects';
// import trans_effects from './model/trans_effects';
// import search_effects from './model/search_effects';
import {
  MENU_HIDE,
  NORMAL_MODE,
  SEARCH_INIT,
  MODAL_HIDE,
  CTP_LOADING,
  CTP_PLAYING,
  ERR_INVALID_MEDIA_ID,
  ERR_AUTH,
} from './Utils';

const initState = {
  userRole: DEFAULT_ROLE,
  error: null,
  media: {
    id: '',
    mediaName: '',
    createdAt: '',
    isTwoScreen: false,
    hasASL: false,
    videos: [],
    transcriptions: [],
    isUnavailable: false,
    flashDetected: false,
  },
  flashAcknowledged: false,
  playlist: {},
  playlists: [],
  offering: {},
  watchHistory: [],
  starredOfferings: [],
  time: 0,
  duration: 0,
  bufferedTime: 0,
  isSwitched: false,
  paused: true,
  isFullscreen: false,
  isFullscreenTwo: false,
  ctpPriEvent: CTP_LOADING,
  ctpSecEvent: CTP_LOADING,
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
  mode: NORMAL_MODE,
  menu: MENU_HIDE,
  modal: MODAL_HIDE,
  liveMode: false,
  englishTrack: undefined,
  currentAudioTrack: 0,
  audioTracks: undefined,
  prompt: null,
  search: SEARCH_INIT,
  mouseOnCaption: false,
  embedded: false,
  textTracks: [],
  currentTranscriptionMulti: { transKeysSelected: [] }, // added as it was referenced
};

// --- Redux Toolkit Slice ---

const watchSlice = createSlice({
  name: 'watch',
  initialState: initState,
  reducers: {
    setError(state, action) {
      state.error = action.payload;
    },
    setMedia(state, action) {
      state.media = action.payload;
      state.embedded = false;
      state.liveMode = action.payload.isLive ? 1 : 0;
    },
    setEmbeddedMedia(state, action) {
      const { media, ...embeddedPayload } = action.payload;
      state.media = media;
      state.embedded = embeddedPayload;
      state.liveMode = media.isLive ? 1 : 0;
    },
    setLiveMode(state, action) {
      state.liveMode = action.payload;
    },
    setTextTracks(state, action) {
      state.textTracks = action.payload;
    },
    setAudioTracks(state, action) {
      state.audioTracks = action.payload;
    },
    setCurrCaptionIndex(state, action) {
      state.currCaptionIndex = action.payload;
    },
    setPlaylist(state, action) {
      state.playlist = action.payload;
    },
    setPlaylists(state, action) {
      state.playlists = action.payload;
    },
    setOffering(state, action) {
      state.offering = action.payload;
    },
    setEventListener(state, action) {
      state.eventListener = action.payload;
    },
    setWatchHistory(state, action) {
      state.watchHistory = action.payload;
    },
    setOffSet(state, action) {
      state.offSet = action.payload;
    },
    setCaptionSpeedUp(state, action) {
      state.captionSpeedUp = action.payload;
    },
    setStarredOfferings(state, action) {
      state.starredOfferings = action.payload;
    },
    setEnglishTrack(state, action) {
      // Remove event listener if needed on previous track (code commented as in original)
      if (state.englishTrack !== undefined) {
        // state.englishTrack.mode = 'hidden';
        // state.englishTrack.removeEventListener('cuechange', state.eventListener);
      }
      const currTrack = document.getElementsByTagName('video')[0]?.textTracks;
      state.englishTrack = currTrack ? currTrack[action.payload] : undefined;
      state.transcript = [];
    },
    setFullscreen(state, action) {
      state.isFullscreen = action.payload;
    },
    setFullscreenTwo(state, action) {
      state.isFullscreenTwo = action.payload;
    },
    // named this way for legacy reasons, to not conflict with the thunk setTranscriptions
    setTranscriptionsReducer(state, action) {
      state.transcriptions = action.payload;
    },
    // named this way for legacy reasons, to not conflict with the thunk setCurrentTranscriptionMulti
    setCurrentTranscriptionMultiReducer(state, action) {
      const { transKey, active } = action.payload;
      let newKeys = state.currentTranscriptionMulti.transKeysSelected.filter(
        (i) => i !== transKey
      );
      if (active) {
        newKeys.push(transKey);
      }
      state.currentTranscriptionMulti.transKeysSelected = newKeys;
    },
    setUpdating(state, action) {
      state.updating = action.payload;
    },
    // named this way for legacy reasons, to not conflict with the thunk setFontSize
    setFontSizeReducer(state, action) {
      state.fontSize = action.payload;
    },
    setTranscript(state) {
      let all = [...state.captions, ...state.descriptions];
      let transcript = all;
      transcript = _.sortBy(
        transcript,
        (item) =>
          `${timeStrToSec(item.begin)
            .toFixed(2)
            .padStart(10)}/${item.transcription.transcriptionType === 0 ? 'Z' : item.transcription.transcriptionType}`
      );
      transcript = transcript.map((item, index) => ({ ...item, index }));
      if (transcript.length === 0) transcript = ARRAY_EMPTY;
      state.transcript = transcript;
    },
    setCaptions(state, action) {
      const parsedCap = action.payload.map((c) => ({ ...c, kind: WEBVTT_SUBTITLES }));
      state.captions = parsedCap;
    },
    setCurrCaption(state, action) {
      state.currCaption = action.payload;
    },
    setDescriptions(state, action) {
      const parsedDes = action.payload.map((d) => ({ ...d, kind: WEBVTT_DESCRIPTIONS }));
      state.descriptions = parsedDes;
    },
    setCurrDescription(state, action) {
      state.currDescription = action.payload;
    },
    setCurrEditing(state, action) {
      state.currEditing = action.payload;
    },
    setBulkEditing(state, action) {
      state.bulkEditing = action.payload;
    },
    setMode(state, action) {
      state.prevmode = state.mode;
      state.mode = action.payload;
    },
    setMenu(state, action) {
      state.menu = action.payload;
    },
    setModal(state, action) {
      state.modal = action.payload;
    },
    setTime(state, action) {
      const payload = action.payload;
      let liveMode = state.liveMode;
      if (state.liveMode === 1) {
        liveMode = payload < state.duration - 60 ? 2 : 1;
      }
      state.time = payload;
      state.liveMode = liveMode;
    },
    setBufferedTime(state, action) {
      state.bufferedTime = action.payload;
    },
    setDuration(state, action) {
      state.duration = action.payload;
    },
    switchScreen(state, action) {
      state.isSwitched = action.payload;
    },
    setMouseOnCaption(state, action) {
      state.mouseOnCaption = action.payload;
    },
    setPause(state, action) {
      // eslint-disable-next-line no-console
      console.log("SET PAUSE", { ...action })
      state.paused = action.payload;
    },
    setCTPEvent(state, action) {
      const { event = CTP_PLAYING, priVideo = true } = action.payload;
      if (priVideo) {
        state.ctpPriEvent = event;
      } else {
        state.ctpSecEvent = event;
      }
    },
    setSearch(state, action) {
      state.search = { ...state.search, ...action.payload };
    },
    resetSearch(state, action) {
      const status = action.payload || SEARCH_HIDE;
      state.search = {
        status,
        value: '',
        inVideoTransResults: ARRAY_INIT,
        inCourseTransResults: ARRAY_INIT,
        playlistResults: ARRAY_INIT,
      };
    },
    setPrompt(state, action) {
      state.prompt = action.payload;
    },
    setReduxState(state, action) {
      Object.assign(state, action.payload);
    },
    setFlashAcknowledged(state, action) {
      state.flashAcknowledged = action.payload;
    },
    changeVideo(state, action) {
      Object.assign(state, action.payload);
      state.time = 0;
      state.duration = 0;
      state.bufferedTime = 0;
      state.isFullscreen = false;
      state.hasASL = false;
      state.ctpPriEvent = CTP_LOADING;
      state.ctpSecEvent = CTP_LOADING;
      state.paused = true;
      state.isSwitched = false;
      state.transcriptions = [];
      state.currTrans = {};
      state.transcript = [];
      state.captions = [];
      state.currCaption = null;
      state.descriptions = [];
      state.currDescription = null;
      state.currEditing = null;
      state.bulkEditing = false;
      state.modal = MODAL_HIDE;
      state.liveMode = false;
      state.prompt = null;
      state.search = SEARCH_INIT;
      state.flashAcknowledged = false;
    },
    resetStates() {
      return initState;
    },
    ...playerEffects,
    // ...menu_effects,
    // ...trans_effects,
    // ...search_effects
  },
});

export const {
  setError,
  setMedia,
  setEmbeddedMedia,
  setLiveMode,
  setTextTracks,
  setAudioTracks,
  setCurrCaptionIndex,
  setPlaylist,
  setPlaylists,
  setOffering,
  setEventListener,
  setWatchHistory,
  setOffSet,
  setCaptionSpeedUp,
  setStarredOfferings,
  setEnglishTrack,
  setFullscreen,
  setFullscreenTwo,
  setTranscriptionsReducer,
  setCurrentTranscriptionMultiReducer,
  setUpdating,
  setFontSizeReducer,
  setTranscript,
  setCaptions,
  setCurrCaption,
  setDescriptions,
  setCurrDescription,
  setCurrEditing,
  setBulkEditing,
  setMode,
  setMenu,
  setModal,
  setTime,
  setBufferedTime,
  setDuration,
  switchScreen,
  setMouseOnCaption,
  setPause,
  setCTPEvent,
  setSearch,
  resetSearch,
  setPrompt,
  setReduxState,
  setFlashAcknowledged,
  changeVideo,
  resetStates,
  toggleFullScreen
} = watchSlice.actions;

export default watchSlice.reducer;

// thunks
export const setupMedia = createAsyncThunk(
  'watch/setupMedia',
  async (_arg, { dispatch }) => {
    // reset media state first
    await dispatch(changeVideo({ media: {} }));
    const { id } = uurl.useSearch();

    let media = null;
    try {
      const { data } = await api.getMediaById(id);
      media = api.parseMedia(data);
    } catch (error) {
      if (api.parseError(error).status === 404) {
        dispatch(setError(ERR_INVALID_MEDIA_ID));
      } else {
        dispatch(setError(ERR_AUTH));
      }
      return null;
    }
    PlayerData.param = {};
    dispatch(setMedia(media));
    dispatch(setMenu(MENU_HIDE));

    // set transcriptions
    const { transcriptions } = media;
    dispatch(setTranscriptionsReducer(transcriptions));

    // Get playlist
    const { playlistId } = media;
    const playlist = await setup.getPlaylist(playlistId);
    if (!playlist) {
      promptControl.error('playlist');
      api.contentLoaded();
      return;
    }
    dispatch(setPlaylist(playlist));

    // Offering
    const { offeringId } = playlist;
    let { data: offering } = await api.getOfferingById(offeringId);
    offering = api.parseSingleOffering(offering);
    dispatch(setOffering(offering));

    // Register ids to user event controller and send select video event
    uEvent.registerIds(media.id, offeringId);
    uEvent.selectvideo(media.id);

    api.contentLoaded();

    // Get playlists
    const playlists = await setup.getPlaylists(offeringId);
    if (playlists) {
      dispatch(setPlaylists(playlists));
    }

    if (isSafari && isIPad13 && isIPhone13) {
      promptControl.videoNotLoading();
    }

    try {
      const { data } = await api.getUserWatchHistories();
      dispatch(setWatchHistory(data.filter((media_) => media_?.id)));
    } catch {
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
    }
  }
);

export const setupEmbeddedMedia = createAsyncThunk(
  'watch/setupEmbeddedMedia',
  async (payload, { dispatch }) => {
    const { mediaId, ...props } = payload;
    let media = payload.media;
    if (!media) {
      if (mediaId) {
        try {
          const { data } = await api.getMediaById(mediaId);
          media = api.parseMedia(data);
        } catch (error) {
          if (api.parseError(error).status === 404) {
            dispatch(setError(ERR_INVALID_MEDIA_ID));
          } else {
            dispatch(setError(ERR_AUTH));
          }
          return false;
        }
      } else {
        return false;
      }
    }
    const transcriptions = media.transcriptions;
    delete props.media;
    await dispatch(setEmbeddedMedia({ media, ...props }));
    await dispatch(setTranscriptionsReducer(transcriptions));
  }
);

export const allWatchThunks = {
  setupMedia,
  setupEmbeddedMedia,
}

// initialize
addInitializer((dispatch) => {
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
})

addSubscription((dispatch, pathname) => {
  if (pathname === '/video') {
    dispatch(setupMedia())
  }
})