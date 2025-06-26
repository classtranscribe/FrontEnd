import { ARRAY_INIT } from 'utils/constants';
import { uurl } from 'utils/use-url';
import { search } from 'utils';
import _ from 'lodash';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addInitializer } from 'model/listener';

const initialState = {
  offerings: ARRAY_INIT,
  searchValue: '',
  searchResult: {},
  result: []
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setOfferings(state, { payload }) {
      state.offerings = payload;
    },
    setSearchValue(state, { payload }) {
      state.searchValue = payload;
    },
    setSearchResult(state, { payload }) {
      state.searchResult = payload;
    },
    setResult(state, { payload }) {
      state.result = payload;
    },
  },

  subscriptions: {
    setup({ dispatch }) {
      document.addEventListener('readystatechange', () => {
        if (document.readyState === "complete") {
          let { q } = uurl.useSearch();
          if (q) {
            let value = _.replace(q, /\+/i, ' ');
            // TODO: Change URL AND PARSE URL WHEN NEEDED
            dispatch({ type: 'search/setSearchValue', payload: value })
          }
        }
      });
    }
  }
});

export const {
  setOfferings,
  setSearchValue,
  setSearchResult,
  setResult
} = searchSlice.actions;

export default searchSlice.reducer;

// thunks
export const searchValue = createAsyncThunk("search/searchValue",
  async (payload, { dispatch, getState }) => {
    const { home } = getState();
    await dispatch(setSearchValue(payload));
    if (!payload) {
      dispatch(setSearchResult({}));
      return;
    }
    const offerings = home.offerings;
    if (offerings === ARRAY_INIT) return;
    const courseResult = search.getResults(
      offerings.filter(off => !off.isTestCourse),
      payload,
      [
        'termName',
        'fullNumber',
        'courseName',
        'sectionName',
      ]
    );
    dispatch(setSearchResult({ courseResult }));
  });

addInitializer((dispatch) => {
  document.addEventListener('readystatechange', () => {
    if (document.readyState === "complete") {
      let { q } = uurl.useSearch();
      if (q) {
        let value = _.replace(q, /\+/i, ' ');
        // TODO: Change URL AND PARSE URL WHEN NEEDED
        dispatch(setSearchValue(value));
      }
    }
  });
})