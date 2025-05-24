// features/epub/epubThunks.js
import { createAsyncThunk } from '@reduxjs/toolkit';
import { uurl, elem, links, prompt, api, timestr } from 'utils';
import SourceTypes from 'entities/SourceTypes';
import ErrorTypes from 'entities/ErrorTypes';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import { EPubData } from 'entities/EPubs';
import Constants from './controllers/constants/EPubConstants';
import { setView, setEPub, setMedia, setPlayerData, setSaved } from './epubSlice';
import { getEPubById, getMediaById } from './service';

export const setupEPub = (ePubId) => async (dispatch) => {
  const { view, h } = uurl.useHash();

  const epub = await getEPubById(ePubId);

  if (Constants.EPubViews.includes(view)) {
    dispatch(setView(view));
  }

  if (h) elem.scrollIntoView(h);

  api.contentLoaded(100);

  if (ErrorTypes.isError(epub)) {
    prompt.error('Failed to load I-Note data.', 5000);
    return;
  }

  dispatch(setEPub(epub));
  links.title(epub.title);

  if (epub.sourceType === SourceTypes.Media) {
    const media = await getMediaById(epub.sourceId);
    dispatch(setMedia(media));
  }
};

export const openPlayer = ({ title, start, end }) => (dispatch, getState) => {
  const state = getState().epub;
  if (!state.epub?.media) return;
  dispatch(setPlayerData({
    title,
    begin: timestr.toSeconds(start),
    end: timestr.toSeconds(end),
  }));
};

export const updateEPub = () => async (dispatch, getState) => {
  dispatch(setSaved(Constants.EpbSaving));
  try {
    const state = getState().epub;
    await api.updateEPub(state.epub);
    dispatch(setSaved(Constants.EpbSaved));
  } catch (e) {
    dispatch(setSaved(Constants.EpbSaveFailed));
    prompt.error('Failed to update I-Note');
  }
};

export const updateEPubBasicInfo = (payload) => async (dispatch) => {
  dispatch(setEPub(payload));
  dispatch(updateEPub());
};

// Add more thunks as needed
