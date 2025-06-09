// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import epubReducer from 'screens/EPub/epubSlice';
import homeReducer from 'screens/Home/homeSlice'
import courseReducer from 'screens/Course/courseSlice'
import instPlaylistReducer from 'screens/Instructor/InstPlaylist/instPlaylistSlice'
import watchReducer from 'screens/Watch/watchSlice'
import playerPrefReducer from 'screens/Watch/playerPrefSlice'
import historyPageReducer from 'screens/History/historyPageSlice'

import { allThunks } from 'model/thunks';

const thunkMap = Object.fromEntries(
  Object.values(allThunks).map((thunk) => [thunk.typePrefix, thunk])
);

// this translates dispatch({type: "slice/action", payload}) to dispatch(action(payload))
// which is necessary since async thunks can't be accessed by plain objects
const legacyThunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'object' && thunkMap[action.type]) {
    return store.dispatch(thunkMap[action.type](action.payload));
  }
  return next(action);
};


const store = configureStore({
  reducer: {
    epub: epubReducer,
    home: homeReducer,
    course: courseReducer,
    instplaylist: instPlaylistReducer,
    watch: watchReducer,
    playerpref: playerPrefReducer,
    historypage: historyPageReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // You can tweak this if needed
    }).concat(legacyThunkMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
