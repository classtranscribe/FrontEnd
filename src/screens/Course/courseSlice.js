
// courseSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { ARRAY_INIT, STUDENT } from 'utils';

const initialState = {
  offering: null,
  playlists: ARRAY_INIT,
  playlist: null,
  starredOfferings: {},
  role: STUDENT,
  isInstMode: false,
};

const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    setOffering(state, action) {
      state.offering = action.payload;
    },
    setPlaylists(state, action) {
      state.playlists = action.payload;
    },
    setPlaylist(state, action) {
      state.playlist = action.payload;
    },
    setStarredOfferings(state, action) {
      state.starredOfferings = action.payload;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    setIsInstMode(state, action) {
      state.isInstMode = action.payload;
    },
    clearCourseData(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setOffering,
  setPlaylists,
  setPlaylist,
  setStarredOfferings,
  setRole,
  setIsInstMode,
  clearCourseData,
} = courseSlice.actions;

export default courseSlice.reducer;