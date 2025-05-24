// homeSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { api, prompt } from 'utils';
import { ARRAY_INIT } from 'utils/constants';
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
