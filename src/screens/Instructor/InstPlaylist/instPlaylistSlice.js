import { createSlice } from '@reduxjs/toolkit';
import { ARRAY_INIT } from 'utils';

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
