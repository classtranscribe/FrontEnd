import { createAsyncThunk } from '@reduxjs/toolkit';
import _ from 'lodash';
import { api, user, InvalidDataError } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';
import HomeConstants from './controllers/HomeConstants';
import { pageLoadError, setOfferings, setSelUniversity, setUniversities, setWatchHistory, setStarredOfferings, setTerms, setDepartments } from './homeSlice';

// --- Async Thunks (former effects) ---
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