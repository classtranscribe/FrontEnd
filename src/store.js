// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import epubReducer from 'screens/EPub/epubSlice';
import homeReducer from 'screens/Home/homeSlice'
import courseReducer from 'screens/Course/courseSlice'
import instPlaylistReducer from 'screens/Instructor/InstPlaylist/instPlaylistSlice'
import watchReducer from 'screens/Watch/watchSlice'
import playerPrefReducer from 'screens/Watch/playerPrefSlice'

const store = configureStore({
  reducer: {
    epub: epubReducer,
    home: homeReducer,
    course: courseReducer,
    instplaylist: instPlaylistReducer,
    watch: watchReducer,
    playerpref: playerPrefReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // You can tweak this if needed
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
