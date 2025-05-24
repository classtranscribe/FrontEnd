// features/epub/epubSlice.js
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { getAllItemsInChapters } from 'entities/EPubs/utils';
import Constants from './controllers/constants/EPubConstants';

const initialState = {
  error: null,
  media: null,
  view: Constants.EpbDefaultView,
  epub: null,
  currChIndex: 0,
  foldedIds: [],
  saved: Constants.EpbSaved,
  navId: null,
  showNav: true,
  imgPickerData: null,
  playerData: null,
  showFileSettings: false,
  showPrefSettings: false,
  showShortcuts: false,
  images: null,
};

const epubSlice = createSlice({
  name: 'epub',
  initialState,
  reducers: {
    setError(state, action) { state.error = action.payload; },
    setView(state, action) {
      state.view = action.payload;
      state.showNav = true;
      if (action.payload === Constants.EpbReadOnly) {
        state.currChIndex = 0;
      }
    },
    setMedia(state, action) { state.media = action.payload; },
    setEPub(state, action) {
      const payload = action.payload;
      if (!payload.chapters) payload.chapters = [];
      state.epub = payload;
      state.images = getAllItemsInChapters(payload.chapters);
    },
    setCurrChIndex(state, action) { state.currChIndex = action.payload; },
    setFoldedIds(state, action) { state.foldedIds = action.payload; },
    foldChapter(state, action) {
      const { folded, id } = action.payload;
      state.foldedIds = folded
        ? [...state.foldedIds, id]
        : _.filter(state.foldedIds, (fid) => fid !== id);
    },
    setSaved(state, action) { state.saved = action.payload; },
    setNavId(state, action) { state.navId = action.payload; },
    setShowNav(state, action) { state.showNav = action.payload; },
    toggleNav(state) { state.showNav = !state.showNav; },
    setImgPickerData(state, action) { state.imgPickerData = action.payload; },
    setPlayerData(state, action) { state.playerData = action.payload; },
    setShowFileSettings(state, action) { state.showFileSettings = action.payload; },
    setShowPrefSettings(state, action) { state.showPrefSettings = action.payload; },
    setShowShortcuts(state, action) { state.showShortcuts = action.payload; },
    toggleShortcuts(state) { state.showShortcuts = !state.showShortcuts; },
    resetStates() { return { ...initialState }; },
    // Add model_data_reducer here...
  },
});

export const {
  setError, setView, setMedia, setEPub, setCurrChIndex, setFoldedIds,
  foldChapter, setSaved, setNavId, setShowNav, toggleNav, setImgPickerData,
  setPlayerData, setShowFileSettings, setShowPrefSettings, setShowShortcuts,
  toggleShortcuts, resetStates,
} = epubSlice.actions;

export default epubSlice.reducer;
