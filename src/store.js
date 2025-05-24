// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import epubReducer from 'screens/EPub/epubSlice';
import homeReducer from 'screens/Home/homeSlice'

const store = configureStore({
  reducer: {
    epub: epubReducer,
    home: homeReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // You can tweak this if needed
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
