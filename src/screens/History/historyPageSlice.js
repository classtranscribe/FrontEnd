import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ARRAY_INIT } from 'utils/constants';
import { api, user, prompt } from 'utils';
import { addInitializer } from 'model/listener';

// Async thunk to fetch watch histories
export const setupWatchHistories = createAsyncThunk(
  'historypage/setupWatchHistories',
  async (_, { rejectWithValue }) => {
    if (!user.isLoggedIn) return [];
    try {
      const { data } = await api.getUserWatchHistories();
      return data.filter(media => media && media.id);
    } catch (error) {
      prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
      return rejectWithValue(error);
    }
  }
);

// Initial state
const initialState = {
  watchHistories: ARRAY_INIT,
};

// Slice definition
const historySlice = createSlice({
  name: 'historypage',
  initialState,
  reducers: {
    setWatchHistories(state, action) {
      state.watchHistories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(setupWatchHistories.fulfilled, (state, action) => {
      state.watchHistories = action.payload;
    });
  },
});

// Optional manual subscription setup like DVA's `subscriptions`
addInitializer((dispatch) => {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === 'complete') {
      dispatch(setupWatchHistories());
    }
  });
});

export const { setWatchHistories } = historySlice.actions;
export default historySlice.reducer;
