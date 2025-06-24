import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addSubscription } from 'model/listener';
import pathToRegexp from 'path-to-regexp';
import { isMobile } from 'react-device-detect';
import { api, links } from 'utils';

async function getMedia(mediaId) {
  try {
    const { data } = await api.getMediaById(mediaId);
    return api.parseMedia(data);
  } catch (error) {
    return api.parseMedia();
  }
}
async function getPlaylist(playlistId) {
  try {
    const { data } = await api.getPlaylistById(playlistId);
    return data;
  } catch (error) {
    return {};
  }
}
const initialState = {
  media: api.parseMedia(),
  playlist: {},
  error: null
}

const mediaSettingSlice = createSlice({
  name: 'mediasetting',
  initialState,
  reducers: {
    setMedia(state, { payload }) {
      state.media = payload;
    },
    setPlaylist(state, { payload }) {
      state.playlist = payload;
    },
    setError(state, { payload }) {
      state.error = payload;
    },
  },
});

export const {
  setMedia,
  setPlaylist,
  setError
} = mediaSettingSlice.actions;

export default mediaSettingSlice.reducer;

// thunks
const loadMediaSettings = createAsyncThunk("mediasetting/loadMediaSettings",
  async (mediaId, { dispatch }) => {
    links.title('Media Settings');

    const media = await getMedia(mediaId);
    if (!media.id) {
      // @TODO prompt
      return;
    }

    dispatch(setMedia(media));
    api.contentLoaded();

    const { playlistId } = media;
    if (playlistId) {
      const playlist = await getPlaylist(playlistId);
      dispatch(setPlaylist(playlist));
    }
  });

export const allMediaSettingThunks = {
  loadMediaSettings
};

// initializers
addSubscription((dispatch, pathname) => {
  const match = pathToRegexp('/media-settings/:id/:option?').exec(pathname);
  if (match) {
    if (!isMobile) {
      dispatch(loadMediaSettings(match[1]));
    } else {
      api.contentLoaded();
    }
  }
});