import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ARRAY_INIT, api, user, links } from 'utils';
import _ from 'lodash';
import ErrorTypes from 'entities/ErrorTypes';
import { addSubscription } from 'model/listener';
import pathToRegexp from 'path-to-regexp';

const initialState = {
  offering: {},
  playlist: {},
  medias: ARRAY_INIT,
  confirmation: null,
};

export const instPlaylistSlice = createSlice({
  name: 'instplaylist',
  initialState,
  reducers: {
    setOffering: (state, action) => { state.offering = action.payload; },
    setPlaylist: (state, action) => { state.playlist = action.payload; },
    setMedias: (state, action) => { state.medias = action.payload; },
    setConfirmation: (state, action) => { state.confirmation = action.payload; },
    clearData: (state) => { Object.assign(state, initialState) },
  },
});

export const {
  setOffering,
  setPlaylist,
  setMedias,
  setConfirmation,
  clearData,
} = instPlaylistSlice.actions;

export default instPlaylistSlice.reducer;

// async thunks
const Util = {
  async getPlaylistById(playlistId) {
    try {
      const { data } = await api.getPlaylistById(playlistId);
      return data;
    } catch (error) {
      return ErrorTypes.getError(error);
    }
  },
  async getOfferingById(offeringId) {
    try {
      const { data } = await api.getOfferingById(offeringId);
      return api.parseSingleOffering(data);
    } catch (error) {
      return ErrorTypes.NotFound404;
    }
  },
  isAuthorized(instructorIds) {
    if (user.isAdmin) return true;
    const instIdx = _.findIndex(instructorIds, { id: user.userId });
    return instIdx >= 0;
  },
};

export const loadModel = createAsyncThunk('instplaylist/loadModel', async (playlistId, { dispatch, getState }) => {
  dispatch(clearData());
  const state = getState();
  let offeringLoaded = false;

  const playlist = await Util.getPlaylistById(playlistId);
  dispatch(setPlaylist(playlist));

  if (!playlist.id) {
    api.contentLoaded();
    return;
  }

  const { offeringId, medias } = playlist;
  dispatch(setMedias(_.map(medias, api.parseMedia)));

  if (!offeringId) return;
  let offering = state.instplaylist.offering;
  if (!offeringLoaded) {
    offering = await Util.getOfferingById(offeringId);
    dispatch(setOffering(offering));
  }

  if (Util.isAuthorized(offering.instructorIds)) {
    api.contentLoaded();
  } else {
    window.location = links.course(offering.id, playlist.id);
  }
});

export const reorderMedias = createAsyncThunk('instplaylist/reorderMedias', async ({ medias, callback }, { dispatch, getState }) => {
  const { instplaylist } = getState();
  const oldMedias = [...instplaylist.medias];
  dispatch(setMedias(medias));
  if (typeof callback === 'function') callback(medias);
  try {
    const mediaIds = _.map(medias, ({ id }) => id);
    await api.reorderMedias(instplaylist.playlist.id, mediaIds);
    prompt.addOne({ text: 'Videos reordered.', timeout: 3000 });
  } catch (error) {
    dispatch(setMedias(oldMedias));
    if (typeof callback === 'function') callback(oldMedias);
    prompt.error('Failed to reorder videos.', { timeout: 5000 });
  }
});

export const renameMedia = createAsyncThunk('instplaylist/renameMedia', async ({ mediaId, name }, { dispatch, getState }) => {
  try {
    const { instplaylist } = getState();
    await api.renameMedia(mediaId, name);
    const medias = [...instplaylist.medias];
    const currIdx = _.findIndex(medias, { id: mediaId });
    if (currIdx >= 0) {
      medias[currIdx].mediaName = name;
      dispatch(setMedias(medias));
      prompt.addOne({ text: 'Video renamed.', timeout: 3000 });
    }
  } catch (error) {
    prompt.error('Failed to rename the video.', { timeout: 5000 });
  }
});

export const deleteMedias = createAsyncThunk('instplaylist/deleteMedias', async (mediaIds, { dispatch, getState }) => {
  try {
    const { instplaylist } = getState();
    for (const mediaId of mediaIds) {
      await api.deleteMedia(mediaId);
    }
    const newMedias = _.filter(instplaylist.medias, me => !_.includes(mediaIds, me.id));
    dispatch(setMedias(newMedias));
    prompt.addOne({ text: 'Video deleted.', timeout: 3000 });
  } catch (error) {
    prompt.error('Failed to delete the video.', { timeout: 5000 });
  }
});

export const deleteASL = createAsyncThunk('instplaylist/deleteASL', async (mediaId, { dispatch, getState }) => {
  try {
    const { instplaylist } = getState();
    let medias = [];
    instplaylist.medias.forEach(m => {
      if (m.id === mediaId) {
        m = { ...m, hasASL: false, aslVideo: undefined, aslPath: undefined };
        delete m.videos[0].aslPath;
      }
      medias.push(m);
    });
    await api.deleteASLVideo(mediaId);
    dispatch(setMedias(medias));
    prompt.addOne({ text: 'ASL Video deleted.', timeout: 3000 });
  } catch (error) {
    prompt.error('Failed to delete the video.', { timeout: 5000 });
  }
});

export const setFlashingWarning = createAsyncThunk('instplaylist/setFlashingWarning', async ({ mediaId, flashWarning }, { dispatch, getState }) => {
  try {
    await api.updateFlashWarningMedia(mediaId, flashWarning);
    const { instplaylist: { medias } } = getState();
    const media = medias.find(m => m.id === mediaId);
    media.flashWarning = flashWarning;
    dispatch(setMedias([...medias]));
  } catch (error) {
    prompt.error('Failed to change flash warning for the video.', { timeout: 5000 });
  }
});

export const setCrowdEditMode = createAsyncThunk('instplaylist/setCrowdEditMode', async ({ mediaId, crowdEditMode }, { dispatch, getState }) => {
  try {
    await api.updateCrowdEditModeMedia(mediaId, crowdEditMode);
    const { instplaylist: { medias } } = getState();
    const media = medias.find(m => m.id === mediaId);
    media.crowdEditMode = crowdEditMode;
    dispatch(setMedias([...medias]));
  } catch (error) {
    prompt.error('Failed to change flash warning for the video.', { timeout: 5000 });
  }
});

// on load
addSubscription((dispatch, pathname) => {
  const match = pathToRegexp('/playlist/:id/:option?', { end: false }).exec(pathname);
  if (match) {
    const playlistId = match[1];
    dispatch(loadModel(playlistId));
  }
})