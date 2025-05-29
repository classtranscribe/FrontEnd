// homeSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api, prompt, user, InvalidDataError } from 'utils';
import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import ErrorTypes from 'entities/ErrorTypes';
import { addSubscription } from 'model/listener';
import HomeConstants from './controllers/HomeConstants';
import FeedSectionBuilder from './controllers/FeedSectionBuilder';

const buildSections = (state) => {
  if (state.error) return;
  const {
    selUniversity, departments, selDepartments,
    selTerms, offerings, starredOfferings, watchHistory,
  } = state;
  const secBuilder = new FeedSectionBuilder(selUniversity, selDepartments, selTerms);
  secBuilder.pushStarredOfferingSection(starredOfferings);
  secBuilder.pushWatchHistorySection(watchHistory);
  secBuilder.pushDepartmentSections(departments, offerings);
  state.hasDepartmentSections = secBuilder.hasDepartmentSections;
  state.sections = secBuilder.getData();
  api.contentLoaded(); // TODO: move this call outside
};

// --- Slice ---
const initialState = {
  error: null,
  universities: ARRAY_INIT,
  departments: ARRAY_INIT,
  terms: ARRAY_INIT,
  selUniversity: null,
  selDepartments: [],
  selTerms: [],
  hasDepartmentSections: false,
  starredOfferings: [],
  watchHistory: [],
  offerings: ARRAY_INIT,
  sections: ARRAY_INIT,
};

const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setUniversities(state, { payload }) {
      state.universities = payload;
    },
    setOfferings(state, { payload }) {
      state.offerings = payload;
    },
    setWatchHistory(state, { payload }) {
      state.watchHistory = payload;
    },
    setStarredOfferings(state, { payload }) {
      state.starredOfferings = payload;
    },
    setTerms(state, { payload }) {
      state.terms = payload;
    },
    setDepartments(state, { payload }) {
      state.departments = payload;
      buildSections(state);
    },
    setSelUniversity(state, { payload }) {
      state.selUniversity = payload;
      state.selDepartments = [];
      state.selTerms = [];
    },
    setSelDepartments(state, { payload }) {
      state.selDepartments = payload;
      buildSections(state);
    },
    setSelTerms(state, { payload }) {
      state.selTerms = payload;
      buildSections(state);
    },
    pageLoadError(state) {
      if (state.error !== HomeConstants.CTHomepageLoadError) {
        console.error(state.error);
        prompt.addOne({
          text: 'Failed to load the page contents.',
          status: 'error',
          position: 'top',
          timeout: -1,
          refresh: true
        });
        state.error = HomeConstants.CTHomepageLoadError;
      }
    }
  },
});

export const {
  setUniversities,
  setOfferings,
  setWatchHistory,
  setStarredOfferings,
  setTerms,
  setDepartments,
  setSelUniversity,
  setSelDepartments,
  setSelTerms,
  pageLoadError
} = homeSlice.actions;

export default homeSlice.reducer;

// Async Thunks
export const getUniversities = createAsyncThunk('home/getUniversities', async (_unused, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.getUniversities();
    if (Array.isArray(data)) {
      const filtered = _.filter(data, uni => uni.id !== HomeConstants.UnknownUniversityID).reverse();
      dispatch(setUniversities(filtered))
      return;
      // return filtered;
    }
    throw InvalidDataError;
  } catch (e) {
    dispatch(pageLoadError());
    return rejectWithValue(ErrorTypes.NotFound404);
  }
});

export const getOfferings = createAsyncThunk('home/getOfferings', async (_unused, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.getOfferingsByStudent();
    if (Array.isArray(data)) {
      dispatch(setOfferings(api.parseOfferings(data.reverse(), !user.isAdmin)));
      return;
    }
    throw InvalidDataError;
  } catch (e) {
    dispatch(pageLoadError());
    return rejectWithValue(ErrorTypes.NotFound404);
  }
});

export const getWatchHistory = createAsyncThunk('home/getWatchHistory', async (_unused, { dispatch }) => {
  if (!user.isLoggedIn) return [];
  try {
    const { data } = await api.getUserWatchHistories();
    dispatch(setWatchHistory(data.filter(media => Boolean(media.id))));
  } catch {
    dispatch(setWatchHistory([]));
  }
});

export const getStarredOfferings = createAsyncThunk('home/getStarredOfferings', async (_unused, { dispatch, getState }) => {
  if (!user.isLoggedIn) return [];
  try {
    const { data } = await api.getUserMetaData();
    const { starredOfferings } = data;
    if (starredOfferings) {
      const ids = Object.keys(JSON.parse(starredOfferings));
      const offerings = getState().home.offerings;
      dispatch(setStarredOfferings(ids.map(id => _.find(offerings, { id })).filter(Boolean)));
      return;
    }
    dispatch(setStarredOfferings([]));
  } catch {
    dispatch(setStarredOfferings([]));
  }
});

export const getTerms = createAsyncThunk('home/getTerms', async (universityId, { dispatch, rejectWithValue }) => {
  try {
    const { data } = await api.getTermsByUniId(universityId);
    if (Array.isArray(data)) {
      dispatch(setTerms(data.reverse()));
      return;
    }
    throw InvalidDataError;
  } catch {
    dispatch(pageLoadError());
    // dispatch(setTerms(rejectWithValue([])));
    return rejectWithValue([]);
  }
});

export const getDepartmentsData = createAsyncThunk('home/getDepartmentsData', async (universityId, { dispatch, getState }) => {
  try {
    const homeState = getState().home;
    let result = universityId
      ? await api.getDepartsByUniId(universityId)
      : await api.getDepartments();
    const university = universityId
      ? _.find(homeState.universities, { id: universityId })
      : null;
    dispatch(setDepartments(_.map(result.data, depart => ({
      ...depart,
      university: university || _.find(homeState.universities, { id: depart.universityId })
    }))));
  } catch {
    dispatch(pageLoadError());
    return [];
  }
});

export const selectUniversity = createAsyncThunk('home/selectUniversity', async (universityId, { dispatch, getState }) => {
  const state = getState().home;
  if (universityId) {
    const uni = _.find(state.universities, { id: universityId });
    if (uni) {
      dispatch(setSelUniversity(universityId));
      await dispatch(getTerms(universityId));
      await dispatch(getDepartmentsData(universityId));
      return;
    }
  }
  await dispatch(getDepartmentsData(null));
});

export const initialize = createAsyncThunk('home/initialize', async (_unused, { dispatch }) => {
  await dispatch(getUniversities());
  await dispatch(getOfferings());
  await dispatch(getWatchHistory());
  await dispatch(getStarredOfferings());
  if (user.isLoggedIn) {
    const uid = user.getUserInfo().universityId;
    await dispatch(selectUniversity(uid !== HomeConstants.UnknownUniversityID ? uid : null));
  } else {
    await dispatch(selectUniversity(null));
  }
});

// on load
addSubscription((dispatch) => {
  dispatch(initialize());
  // const ready = () => document.readyState === 'complete';
  // if (ready()) dispatch(initialize());
  // else {
  //   const listener = () => {
  //     if (ready()) {
  //       dispatch(initialize());
  //       document.removeEventListener('readystatechange', listener);
  //     }
  //   };
  //   document.addEventListener('readystatechange', listener);
  // }
})