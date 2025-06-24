/* eslint-disable no-console */
import _ from 'lodash';
import { api, prompt, links, uurl, elem, timestr } from 'utils';
import pathToRegexp from 'path-to-regexp';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import ErrorTypes from 'entities/ErrorTypes';
import SourceTypes from 'entities/SourceTypes';
import { EPubData } from 'entities/EPubs';
import { getAllItemsInChapters } from 'entities/EPubs/utils'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addSubscription } from 'model/listener';
import Constants from './controllers/constants/EPubConstants'
import { getEPubById, getMediaById } from './service'
import model_data_reducer from './models/dataReducer'

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
}

const epubSlice = createSlice({
  name: 'epub',
  initialState,
  reducers: {
    setError(state, { payload }) {
      state.error = payload;
    },
    setView(state, { payload }) {
      state.view = payload;
      state.showNav = true;
      state.currChIndex = payload === Constants.EpbReadOnly ? 0 : state.currChIndex;
    },
    setMedia(state, { payload }) {
      state.media = payload;
    },
    setEPub(state, { payload }) {
      const items = getAllItemsInChapters(payload.chapters);

      if (!payload.chapters) {
        payload.chapters = []
      }
      state.epub = payload;
      state.images = items;
    },
    setCurrChIndex(state, { payload }) {
      state.currChIndex = payload;
    },
    setFoldedIds(state, { payload }) {
      state.foldedIds = payload;
    },
    foldChapter(state, { payload: { folded, id } }) {
      state.foldedIds = folded ? [...state.foldedIds, id] : _.filter(state.foldedIds, (fid) => fid !== id);
    },
    setSaved(state, { payload }) {
      state.saved = payload;
    },

    setNavId(state, { payload }) {
      state.navId = payload;
    },
    setShowNav(state, { payload }) {
      state.showNav = payload;
    },
    toggleNav(state) {
      state.showNav = !state.showNav
    },
    setImgPickerData(state, { payload }) {
      state.imgPickerData = payload;
    },
    setPlayerData(state, { payload }) {
      state.playerData = payload;
    },
    setShowFileSettings(state, { payload }) {
      state.showFileSettings = payload;
    },
    setShowPrefSettings(state, { payload }) {
      state.showPrefSettings = payload;
    },
    setShowShortcuts(state, { payload }) {
      state.showShortcuts = payload;
    },
    toggleShortcuts(state) {
      state.showShortcuts = !state.showShortcuts
    },
    resetStates(state) {
      Object.assign(state, initialState);
    },
    ...model_data_reducer
  },

});

export const {
  setError,
  setView,
  setMedia,
  setEPub,
  setCurrChIndex,
  setFoldedIds,
  foldChapter,
  setSaved,
  setNavId,
  setShowNav,
  toggleNav,
  setImgPickerData,
  setPlayerData,
  setShowFileSettings,
  setShowPrefSettings,
  setShowShortcuts,
  toggleShortcuts,
  resetStates,

  // from dataReducer.js
  subdivideChapter,
  splitChapterFromChaptersItems,
  undoSubdivideChapter,
  splitSubChapter,
  undoSplitSubChapter,
  splitChapterFromSubChapter,
  splitChapterFromSubChaptersItems,
  undoSplitChapter,
  sliceChapter,
  mergeChapter,
  appendChapterAsSubChapter,
  saveSubChapterTitle,
  saveChapterTitle,
  splitChaptersByScreenshotsReducer,
  resetToDefaultChaptersReducer,
  insertChapterContent,
  insertChapterContentAtChapterIdx,
  setChapterContent,
  setChapterContentAtChapterIdx,
  removeChapterContent,
  removeChapterContentAtChapterIdx
} = epubSlice.actions;

export default epubSlice.reducer

// thunks
const setupEPub = createAsyncThunk("epub/setupEPub",
  async (ePubId, { dispatch }) => {
    let _epub = await getEPubById(ePubId);
    const { view, h } = uurl.useHash();
    if (Constants.EPubViews.includes(view)) {
      dispatch(setView(view));
    }
    if (h) {
      elem.scrollIntoView(h);
    }

    api.contentLoaded(100);

    if (ErrorTypes.isError(_epub)) {
      prompt.error('Failed to load I-Note data.', 5000);
      return;
    }
    dispatch(setEPub(_epub));

    links.title(_epub.title);

    if (_epub.sourceType === SourceTypes.Media) {
      const media = await getMediaById(_epub.sourceId);
      dispatch(setMedia(media));
    }
  });

const openPlayer = createAsyncThunk("epub/openPlayer",
  async ({ title, start, end }, { dispatch, getState }) => {
    const { epub } = getState();
    if (!epub.media) return;
    dispatch(setPlayerData({
      title,
      begin: timestr.toSeconds(start),
      end: timestr.toSeconds(end)
    }));
  });

const duplicateEPub = createAsyncThunk("epub/duplicateEPub",
  async ({ newData, copyChapterStructure }, { getState }) => {
    prompt.addOne({ text: 'Copying I-Note data...', timeout: 4000 });
    const { epub } = getState();
    const oldData = epub.epub;
    const newLanguage = newData.language;
    const isDifferentLanguage = newLanguage !== epub.epub.language;
    if (!newData.chapters) {
      newData.chapters = epub.epub.chapters;
    }

    if (isDifferentLanguage) {
      const rawEPubData = await EPubListCtrl.getRawEPubData(
        oldData.sourceType, oldData.sourceId, newLanguage
      );

      newData = EPubData.create(rawEPubData, newData, copyChapterStructure).toObject();
    }

    delete newData.id;

    const newEPubData = await EPubListCtrl.postEPubData(newData);
    if (!newEPubData) {
      prompt.error('Failed to create the I-Note.');
      return;
    }

    uurl.openNewTab(links.epub(newEPubData.id, Constants.EditINote));
  });

const deleteEPub = createAsyncThunk("epub/deleteEPub",
  async ({ ePubId }) => {
    try {
      await api.deleteEPub(ePubId);
      window.close();
    } catch (error) {
      console.error(error);
      prompt.error('Failed to delete the I-Note.');
    }
  });

const updateEPub = createAsyncThunk("epub/updateEPub",
  async (_arg, { dispatch, getState }) => {
    dispatch(setSaved(Constants.EpbSaving));
    const { epub } = getState();
    try {
      await api.updateEPub(epub.epub);
      dispatch(setSaved(Constants.EpbSaved));
      /*
      if (this.__notifyOnce) {
          this.__notifyOnce = false;
          prompt.addOne({ status: 'success', text: 'Saved!', timeout: 4000 });
      }
      */ // NOT IMPLEMENTED
    } catch (error) {
      prompt.error('Failed to update I-Note');
      dispatch(setSaved(Constants.EpbSaveFailed));
    }
  });

const updateEPubBasicInfo = createAsyncThunk("epub/updateEPubBasicInfo",
  async (payload, { dispatch }) => {
    await dispatch(setEPub(payload));
    dispatch(updateEPub());
  });

const updateEpubData = createAsyncThunk("epub/updateEpubData",
  async ({ payload, action }, { dispatch }) => {
    await dispatch({ type: `epub/${action}`, payload });
    dispatch(updateEPub());
  });

const splitChaptersByScreenshots = createAsyncThunk("epub/splitChaptersByScreenshots",
  async (_arg, { dispatch }) => {
    await dispatch(splitChaptersByScreenshotsReducer())
    prompt.addOne({
      text: 'Split chapters by screenshots.',
      position: 'left bottom',
      timeout: 2000,
    });
    dispatch(updateEPub());
  });

const resetToDefaultChapters = createAsyncThunk("epub/resetToDefaultChapters",
  async (_arg, { dispatch }) => {
    await dispatch(resetToDefaultChaptersReducer());
    prompt.addOne({
      text: 'Reset to the default chapters.',
      position: 'left bottom',
      timeout: 2000,
    });
    dispatch(updateEPub());
  });

export const allEPubThunks = {
  setupEPub,
  openPlayer,
  duplicateEPub,
  deleteEPub,
  updateEPub,
  updateEPubBasicInfo,
  updateEpubData,
  splitChaptersByScreenshots,
  resetToDefaultChapters
};

// initializer
addSubscription((dispatch, pathname) => {
  const match = pathToRegexp('/epub/:id/:option?').exec(pathname);
  if (match) {
    dispatch(setupEPub(match[1]));
  }
});