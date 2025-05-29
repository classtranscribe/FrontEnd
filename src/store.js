// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import epubReducer from 'screens/EPub/epubSlice';
import homeReducer from 'screens/Home/homeSlice'
import courseReducer from 'screens/Course/courseSlice'
import instPlaylistReducer from 'screens/Instructor/InstPlaylist/instPlaylistSlice'

const store = configureStore({
  reducer: {
    epub: epubReducer,
    home: homeReducer,
    course: courseReducer,
    instplaylist: instPlaylistReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // You can tweak this if needed
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
