import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ARRAY_INIT, STUDENT, INSTRUCTOR, api, user, prompt } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import UserEventManager from 'entities/UserEvent';
import { setOffering, setRole, clearCourseData, setIsInstMode, setPlaylist, setPlaylists, setStarredOfferings } from './courseSlice';

const getStarredOfferings = async () => {
  try {
    const { data } = await api.getUserMetaData();
    return data.starredOfferings ? JSON.parse(data.starredOfferings) : {};
  } catch {
    return {};
  }
};

// Async Thunks

export const loadCourse = createAsyncThunk(
  'course/loadCourse',
  async (offeringId, { dispatch, getState }) => {
    const { course } = getState();
    if (course.offering?.id !== offeringId) {
      dispatch(clearCourseData());
    }

    let offering = ErrorTypes.NotFound404;
    try {
      const { data } = await api.getOfferingById(offeringId);
      offering = api.parseSingleOffering(data);
    } catch {
      // Do nothing
    }

    dispatch(setOffering(offering));
    api.contentLoaded();

    if (offering === ErrorTypes.NotFound404) return;

    const isInstructor = _.findIndex(
      offering.instructorIds,
      { email: user.getUserInfo().emailId }
    ) >= 0 || user.isAdmin;

    if (isInstructor) {
      dispatch(setRole(INSTRUCTOR));
      dispatch(setIsInstMode(true));
    }

    try {
      const { data: playlists } = await api.getPlaylistsByOfferingId(offeringId);
      dispatch(setPlaylists(playlists));

      const starredOfferings = await getStarredOfferings();
      dispatch(setStarredOfferings(starredOfferings));
    } catch {
      dispatch(setPlaylists(ErrorTypes.NotFound404));
    }
  }
);

export const setStar = createAsyncThunk(
  'course/setStar',
  async ({ offeringId, isStar }, { dispatch, getState }) => {
    const { starredOfferings } = getState().course;
    const updatedStars = { ...starredOfferings };
    if (isStar) {
      updatedStars[offeringId] = 'starred';
    } else {
      delete updatedStars[offeringId];
    }

    try {
      await api.postUserMetaData({
        starredOfferings: JSON.stringify(updatedStars),
      });
      dispatch(setStarredOfferings(updatedStars));
    } catch {
      prompt.addOne({ text: 'Failed to star the course', status: 'error' });
    }
  }
);

export const updatePlaylists = createAsyncThunk(
  'course/updatePlaylists',
  async (newPlaylists, { dispatch, getState }) => {
    const { offering, playlists: oldPlaylists } = getState().course;

    dispatch(setPlaylists(newPlaylists));

    try {
      const playlistIds = newPlaylists.map(p => p.id);
      await api.reorderPlaylists(offering.id, playlistIds);
      prompt.addOne({ text: 'Playlists reordered.', timeout: 3000 });
    } catch {
      dispatch(setPlaylists(oldPlaylists));
      prompt.addOne({ text: 'Failed to reorder playlists.', timeout: 5000 });
    }
  }
);

export const getPlaylistById = createAsyncThunk(
  'course/getPlaylistById',
  async (playlistId, { dispatch }) => {
    try {
      const { data } = await api.getPlaylistById(playlistId);
      dispatch(setPlaylist(data));
    } catch {
      dispatch(setPlaylist(ErrorTypes.NotFound404));
    }
  }
);
