import { api, user, prompt, InvalidDataError, ARRAY_INIT } from 'utils';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { addSubscription } from 'model/listener';

async function getMyOfferings() {
  try {
    let { data } = await api.getCourseOfferingsByInstructorId(user.userId);
    return data;
  } catch (error) {
    return api.errorType(error);
  }
}
function getFullNumber(offs) {
  let fullNumber = '';
  _.forEach(offs, (off, index) => {
    const { courseNumber } = off;
    const { acronym } = off.depart;
    if (index > 0) fullNumber += '/';
    fullNumber += acronym + courseNumber;
  });

  return fullNumber;
}
async function getTerms() {
  try {
    const { data } = await api.getTermsByUniId(user.getUserInfo().universityId);
    if (Array.isArray(data)) {
      return data.slice().reverse();
    }
    throw InvalidDataError;
  } catch (error) {
    prompt.error('Failed to load terms.');
    return [];
  }
}

async function getDepartments() {
  try {
    let { data } = await api.getDepartsByUniId(user.getUserInfo().universityId);
    return data;
  } catch (error) {
    return [];
  }
}
function parseCourseOfferings(courseOfferings = [], departs, terms) {
  // console.log('rawOfferings', courseOfferings)
  if (courseOfferings.length === 0) return [];

  let offerArray = _.map(courseOfferings, (co) => {
    const { courseNumber, departmentId } = co.course;
    const depart = _.find(departs, { id: departmentId });
    const offerings = _.map(co.offerings, (off) => {
      const term = _.find(terms, { id: off.termId });

      if (!term || !depart) {
        console.error('Detect invalid offering', off.id);
        return null;
      }

      return {
        ...off,
        termName: term.name,
        term,
        depart,
        courseNumber,
        course: { ...co.course, acronym: depart.acronym, depart },
      };
    });

    return offerings;
  });

  offerArray = _.filter(_.flatten(offerArray), off => off !== null);

  const offerIds = _.groupBy(offerArray, 'id');
  const offerings = _.map(offerIds, (offs) => {
    const off = offs[0];

    const courses = _.map(offs, (o) => o.course);
    off.courses = courses;

    const fullNumber = getFullNumber(offs);
    off.fullNumber = fullNumber;

    if (off.course) delete off.course;
    if (off.depart) delete off.depart;
    return off;
  });

  // console.log('offerings', offerings)
  return (offerings || []).slice().reverse();
}

const initialState = {
  terms: [],
  offerings: ARRAY_INIT,
}
const instCourseSlice = createSlice({
  name: 'instcourse',
  initialState,
  reducers: {
    setTerms(state, { payload }) {
      state.terms = payload;
    },
    setMyOfferings(state, { payload }) {
      state.offerings = payload;
    },
  }
});

export const {
  setTerms,
  setMyOfferings
} = instCourseSlice.actions;

// thunks
export const loadModel = createAsyncThunk(
  "instcourse/loadModel",
  async (_arg, { dispatch }) => {
    let terms = await getTerms();
    dispatch(setTerms(terms));

    let departs = await getDepartments();
    let offerings = await getMyOfferings();

    api.contentLoaded();
    if (api.isError(offerings)) {
      dispatch(setMyOfferings(offerings));
      return;
    }
    dispatch(setMyOfferings(parseCourseOfferings(offerings, departs, terms)));
  }
)

// initializer
addSubscription((dispatch, pathname) => {
  const match = pathToRegexp('/instructor/my-courses/:option?').exec(pathname);
  if (match) {
    dispatch(loadModel());
  }
});

export default instCourseSlice.reducer;