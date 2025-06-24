// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import epubReducer from 'screens/EPub/epubSlice';
import homeReducer from 'screens/Home/homeSlice'
import courseReducer from 'screens/Course/courseSlice'
import instPlaylistReducer from 'screens/Instructor/InstPlaylist/instPlaylistSlice'
import watchReducer from 'screens/Watch/watchSlice'
import playerPrefReducer from 'screens/Watch/playerPrefSlice'
import historyPageReducer from 'screens/History/historyPageSlice'
import instCourseReducer from 'screens/Instructor/MyCourses/instCourseSlice'

import { allThunks } from 'model/thunks';

const thunkMap = Object.fromEntries(
  Object.values(allThunks).map((thunk) => [thunk.typePrefix, thunk])
);

// this translates dispatch({type: "slice/action", payload}) to dispatch(action(payload))
// which is necessary since async thunks can't be accessed by plain objects
const legacyThunkMiddleware = (store) => (next) => (action) => {
  if (typeof action === 'object' && thunkMap[action.type]) {
    // eslint-disable-next-line no-console
    console.log("middleware", action.type, action.payload);
    return store.dispatch(thunkMap[action.type](action.payload));
  }
  return next(action);
};

const actionStackMap = new Map(); // action.requestId => stack
export const rethrowRejectedMiddleware = (store) => (next) => (action) => {
  // Record the stack when the thunk is first dispatched
  if (action.type.endsWith('/pending') && action.meta?.requestId) {
    const stack = new Error().stack;
    actionStackMap.set(action.meta.requestId, stack);
  }

  // On rejected, rethrow with original stack
  if (action.type.endsWith('/rejected') && action.meta?.requestId) {
    const originalStack = actionStackMap.get(action.meta.requestId);
    const error = action.payload ?? action.error;

    if (process.env.NODE_ENV !== 'production') {
      const enrichedError = new Error(
        `[Thunk Rejected: ${action.type}] ${error?.message || JSON.stringify(error)}`
      );
      if (originalStack) {
        enrichedError.stack = `${enrichedError.message}\nDispatched at:\n${originalStack}`;
      }
      console.error(enrichedError); // still visible even if caught
      throw enrichedError;
    }
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
    historypage: historyPageReducer,
    instcourse: instCourseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // You can tweak this if needed
    }).concat(legacyThunkMiddleware).concat(rethrowRejectedMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;
