import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { isMobile } from 'react-device-detect';
import { addInitializer, addSubscription } from 'model/listener';
import {
  CC_COLOR_WHITE,
  CC_COLOR_BLACK,
  CC_SIZE_100,
  CC_SIZE_75,
  CC_FONT_SANS_SERIF,
  CC_OPACITY_75,
  CC_SPACING_DEFAULT,
  CC_POSITION_BOTTOM,
  SCREEN_OPACITY_100,
  SCREEN_CONTRAST_100,
  SCREEN_ZOOM_100,
  ROTATE_COLOR_0,
  INVERT_0,
  AD_VOLUME_DEFAULT,
  AD_SPEED_DEFAULT,
  scrollTransToView,
} from './Utils';
import { uEvent } from './Utils/UserEventController';
import { LINE_VIEW, TRANSCRIPT_VIEW } from './Utils/constants.util';

function storageAvailable(type) {
  let storage;
  try {
    storage = window[type];
    let x = '__storage_test__';
    storage.setItem(x, x);
    storage.removeItem(x);
    return true;
  } catch (e) {
    return (
      e instanceof DOMException &&
      (e.code === 22 ||
        e.code === 1014 ||
        e.name === 'QuotaExceededError' ||
        e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
      storage &&
      storage.length !== 0
    );
  }
}
const storageAvailablity = storageAvailable('localStorage');

function updateLocalStorage(playerpref) {
  if (storageAvailablity) {
    localStorage.setItem('CT_preference', JSON.stringify(playerpref));
  }
}

const initialState = {
  volume: 1,
  muted: false,
  playbackrate: 1,

  cc_color: CC_COLOR_WHITE,
  cc_bg: CC_COLOR_BLACK,
  cc_size: isMobile ? CC_SIZE_75 : CC_SIZE_100,
  cc_font: CC_FONT_SANS_SERIF,
  cc_position: CC_POSITION_BOTTOM,
  cc_opacity: CC_OPACITY_75,
  cc_spacing: CC_SPACING_DEFAULT,

  transView: isMobile ? TRANSCRIPT_VIEW : LINE_VIEW,
  prevTransView: null,

  openCC: true,
  openAD: false,
  aslCorner: 0,

  autoPlay: !isMobile,
  brightness: SCREEN_OPACITY_100,
  contrast: SCREEN_CONTRAST_100,
  rotateColor: ROTATE_COLOR_0,
  invert: INVERT_0,
  scale: SCREEN_ZOOM_100,
  magnifyX: 0,
  magnifyY: 0,

  pauseWhileAD: false,
  description: '',
  ADVolume: AD_VOLUME_DEFAULT,
  ADSpeed: AD_SPEED_DEFAULT,
  stopAD: false,

  autoScroll: true,
  pauseWhileEditing: !isMobile,
  showCaptionTips: true,
};

const playerPrefSlice = createSlice({
  name: 'playerpref',
  initialState,
  reducers: {
    setPreference(state, action) {
      Object.assign(state, action.payload);
      updateLocalStorage(state);
    },
    setTransView(state, action) {
      let view = action.payload;
      if (view === null) {
        view = state.prevTransView ?? state.transView;
      }
      state.prevTransView = state.transView;
      state.transView = view;
      updateLocalStorage(state);
    },

    toggleOpenAD(state) {
      state.openAD = !state.openAD;
      updateLocalStorage(state);
    },
    toggleOpenCC(state) {
      state.openCC = !state.openCC;
      updateLocalStorage(state);
    },
    toggleASLPosition(state) {
      state.aslCorner = (1 + state.aslCorner) % 3;
      updateLocalStorage(state);
    },
    changePlaybackrateByValue(state, action) {
      const target = state.playbackrate + action.payload;
      if (target > 4 || target < 0.25) return;
      state.playbackrate = target;
      updateLocalStorage(state);
    },
    changeXTranslateByValue(state, action) {
      state.magnifyX += action.payload;
      updateLocalStorage(state);
    },
    changeYTranslateByValue(state, action) {
      state.magnifyY += action.payload;
      updateLocalStorage(state);
    },
    changeCCSizeByValue(state, action) {
      const target = state.cc_size + action.payload;
      if (target > 2 || target < 0.75) return;
      state.cc_size = target;
      updateLocalStorage(state);
    },

    // Load preference from storage (subscription replacement)
    loadPreference(state, action) {
      if (action.payload) {
        Object.assign(state, action.payload);
      }
    },
  },
});

export const {
  setPreference,
  setTransView,
  toggleOpenAD,
  toggleOpenCC,
  toggleASLPosition,
  changePlaybackrateByValue,
  changeXTranslateByValue,
  changeYTranslateByValue,
  changeCCSizeByValue,
} = playerPrefSlice.actions;

export default playerPrefSlice.reducer;

// thunks
export const setTransViewAsync = createAsyncThunk(
  'playerpref/setTransViewAsync',
  async ({ view, config = {} }, { getState, dispatch }) => {
    const { sendUserAction = true, updatePrefer = true } = config;
    const state = getState();
    const watch = state.watch;

    // Trigger scroll on next tick
    setTimeout(() => {
      if (watch.caption?.id) {
        scrollTransToView(watch.currCaption.id, false, watch.media?.isTwoScreen);
      }
    }, 1);

    if (sendUserAction) {
      uEvent.transviewchange(watch.time, view);
    }

    // Dispatch the sync state update
    dispatch(setTransView(view));

    // Update localStorage after state update
    if (updatePrefer) {
      const playerpref = getState().playerpref;
      updateLocalStorage(playerpref);
    }

    return view; // thunk result
  }
);

// Async thunk to load preference from storage on app init
export const loadPreferenceFromStorage = createAsyncThunk(
  'playerpref/loadPreferenceFromStorage',
  async (_arg, { dispatch }) => {
    if (storageAvailablity) {
      try {
        const preference = JSON.parse(localStorage.getItem('CT_preference'));
        if (preference) {
          dispatch(setPreference(preference));
        }
      } catch {
        // ignore errors
      }
    }
  }
);

export const allPlayerPrefThunks = {
  setTransViewAsync,
  loadPreferenceFromStorage
}

// initialize
addInitializer((dispatch) => {
  if (storageAvailablity) {
    try {
      const preference = JSON.parse(localStorage.getItem('CT_preference'));
      // would execute "save to localStorage" again
      dispatch(setPreference(preference));
    } catch {
      // CATCH
    }
  }
})

addSubscription((dispatch) => {
  if (storageAvailablity) {
    try {
      const preference = JSON.parse(localStorage.getItem('CT_preference'));
      // would execute "save to localStorage" again
      dispatch({ type: 'setPreference', payload: preference });
    } catch {
      // CATCH
    }
  }
})