/* eslint-disable no-console */
/* eslint-disable complexity */

import { api } from 'utils';
import _ from 'lodash';
// import { isMobile } from 'react-device-detect';
import { /* CROWDEDIT_ALLOW, */CROWDEDIT_FREEZE_ALL } from 'utils/constants.js';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { promptControl } from '../Utils/prompt.control';
import { timeStrToSec } from '../Utils/helpers';

import { uEvent } from '../Utils/UserEventController';
import { scrollTransToView, findTransByLanguages } from '../Utils'
/**
 * * Find subtitle based on current time
*/
const findCurrent = (array = [], prev = {}, now = 0, deterFunc) => {
  if (!array || array.length === 0) return null;
  let next = prev;
  const isCurrent = (item) => {
    if (!item) return false; // Check the item type
    const end = timeStrToSec(item.end);
    const begin = timeStrToSec(item.begin);
    let deter = true;
    if (deterFunc) deter = deterFunc(item, prev);
    return begin <= now && now <= end && deter;
  };

  // if it's the first time to find captions
  if (!prev) {
    next = _.find(array, isCurrent) || null;

    // if looking for caption that is after the current one
  } else if (now > timeStrToSec(prev.begin)) {
    next = _.find(array, isCurrent, prev.index + 1) || prev;

    // if looking for caption that is prior to the current one
  } else if (now < timeStrToSec(prev.end)) {
    next = _.findLast(array, isCurrent, prev.index - 1) || prev;
  }

  return next;
}

const findCurrentDescription = (descriptions, currentTime) => {
  let closestDescription = null;
  let maxEndTime = -Infinity;

  for (const description of descriptions) {
    const endTime = timeStrToSec(description.end);

    // Check if the description ends before or at the current time
    if (endTime <= currentTime && endTime > maxEndTime) {
      maxEndTime = endTime;
      closestDescription = description;
    }
  }

  return closestDescription;
};

export const setCurrTrans = createAsyncThunk('watch/setCurrTrans',
  async ({ trans }, { dispatch }) => {
    // console.log("Starting setCurrTrans with trans payload:", trans);

    // Ensure trans is an array
    if (!Array.isArray(trans)) {
      trans = [trans];
    }
    // // console.log("Normalized trans array:", trans); 

    let alldata;
    if (trans.length > 0) {
      // // console.log("Fetching captions for each transcription ID...");

      // Fetch data for each transcription ID
      const allTranscriptionData = await Promise.all(
        trans.map((tran) => api.getCaptionsByTranscriptionId(tran.id))
      );
      // // console.log("Fetched allTranscriptionData:", allTranscriptionData);

      // Attach transcription reference to each caption
      allTranscriptionData.forEach((captionList, listIndex) => {
        const t = trans[listIndex];
        captionList.data?.forEach((c) => {
          c.transcription = t;
          // // console.log(`Assigned transcription for caption (ID: ${c.id}):`, c.transcription);
        });
      });

      // Merge all caption data into alldata
      alldata = allTranscriptionData.reduce((acc, { data = [] }) => [...acc, ...data], []);
      // // console.log("Combined alldata:", alldata);
    }

    if (alldata === undefined) {
      alldata = [];
    }

    // Filter captions by transcription type
    let closedcaptions = alldata.filter((c) => c.transcription.transcriptionType === 0);
    let descriptions = alldata.filter((c) => c.transcription.transcriptionType !== 0);
    // // console.log("Filtered closedcaptions:", closedcaptions);
    // // console.log("Filtered descriptions:", descriptions);

    // Dispatch closed captions
    dispatch({ type: 'watch/setCaptions', payload: closedcaptions });

    // Dispatch descriptions
    const descriptionData = descriptions;
    // // console.log("Dispatching descriptionData:", descriptionData);
    await dispatch({ type: 'watch/setDescriptions', payload: descriptionData });

    // Dispatch final transcript set
    dispatch({ type: 'watch/setTranscript' });
    // // console.log("Completed setCurrTrans");
  }
);

export const setTranscriptions = createAsyncThunk('watch/setTranscriptions',
  async (trans, { dispatch, getState }) => {
    const { playerpref } = getState();
    let keys = playerpref.transKeys;
    if (keys === undefined) {
      // No preference, so look for 1 caption and 1 description... 
      const seen = new Set();
      keys = [];
      for (const t of trans) {
        if (!seen.has(t.transcriptionType)) {
          keys.push(t.transKey);
          seen.add(t.transcriptionType);
        }
      }
      dispatch({
        type: 'playerpref/setPreference', payload: { transKeys: keys }
      });
    }
    for (const t of keys) {
      dispatch({
        type: 'watch/setCurrentTranscriptionMultiReducer',
        payload: { transKey: t, active: true },
      });
    }
  }
)

export const updateTranscript = createAsyncThunk('watch/updateTranscript',
  async ({ currentTime }, { dispatch, getState }) => {
    const { watch, playerpref } = getState();
    const prevCaption_ = watch.caption;
    // TODO: Fix: if watch.transcript is ARRAY_EMPTY (?) or length 0 then findCurrent will 
    // return with the current transcript. Should put({ type: 'setCurrCaption', payload: null

    // TODO: is index reset in frontend? the findCurrent assumes index are increasing integers
    // Ans: Yes in model.js/setTranscript, after filtering wanted transcriptions -
    // "transcript= _.map(transcript, (item, index) => ({ ...item, index }));


    const next = findCurrent(watch.transcript, prevCaption_, currentTime);
    if (next && next.id) {
      // // console.log(next);
      // pause video if it's AD

      // determine whether should scroll smoothly
      const smoothScroll =
        prevCaption_ && next && Math.abs(prevCaption_.index - next.index) === 1;
      dispatch({ type: 'watch/setCurrCaption', payload: next });

      if (playerpref.autoScroll && !watch.mouseOnCaption && !watch.currEditing) {
        const { media = {} } = watch;
        scrollTransToView(next.id, smoothScroll, media.isTwoScreen);
      }
    } else {
      dispatch({ type: 'watch/setCurrCaption', payload: null });
    }
    // // console.log(watch)
    // // console.log(`pauseWhileAD:${playerpref.pauseWhileAD}`);
    const nextDescription = findCurrentDescription(watch.descriptions, currentTime);
    if (playerpref.openAD && nextDescription) {
      const nextDescriptionBeginTime = timeStrToSec(nextDescription.begin);
      if (Math.abs(currentTime - nextDescriptionBeginTime) <= 1) {
        if (playerpref.pauseWhileAD) {
          dispatch({ type: 'watch/media_pause' });
        }
        // Speak out loud 
        // // console.log(`SPEAK ${nextDescription.text}`);
        dispatch({ type: 'playerpref/setPreference', payload: { description: nextDescription.text } })
      }
    }
    return next || null;
  }
);

export const setLanguage = createAsyncThunk('watch/setLanguage',
  async ({ language }, { dispatch, getState }) => {
    const { watch } = getState();
    const currTrans = findTransByLanguages(watch.transcriptions, [language]);
    if (currTrans) {
      dispatch({ type: 'watch/setCurrTrans', payload: currTrans });
    }
    uEvent.langchange(watch.time, language);
    uEvent.registerLanguage(language);
  }
);

export const setCurrentTranscriptionMulti = createAsyncThunk('watch/setCurrentTranscriptionMulti',
  async (_arg, { dispatch, getState }) => {
    const { watch } = getState();

    const selected = watch.currentTranscriptionMulti.transKeysSelected

    const currTrans = watch.transcriptions.filter((t) => selected.includes(t.transKey));

    // if (currTrans.length > 0) {
    dispatch({ type: 'watch/setCurrTrans', payload: currTrans });
    // }
    const currKeys = currTrans.map((t) => t.transKey);
    // remember preference for next time
    dispatch({ type: 'playerpref/setPreference', payload: { transKeys: currKeys } });
    // TODO - fix uEvent
    // uEvent.langchange(watch.time, language);
    // uEvent.registerLanguage(language);
  }
)

export const setTransEditMode = createAsyncThunk('watch/setTransEditMode',
  async ({ caption }, { dispatch, getState }) => {
    // if no param caption, edit current caption
    const { watch, playerpref } = getState();

    const media = watch.media;
    const crowdEdit = media.crowdEditMode !== CROWDEDIT_FREEZE_ALL;
    if (!crowdEdit) {
      return;
    }

    const currCap = caption || watch.currCaption_;
    dispatch({ type: 'watch/setCurrEditing', payload: currCap });
    if (playerpref.pauseWhileEditing) {
      dispatch({ type: 'watch/media_pause' });
    }
    if (playerpref.showCaptionTips) {
      promptControl.editCaptionTips();
      dispatch({ type: 'playerpref/setPreference', payload: { showCaptionTips: false } });
    }
  }
);

export const timestampFailed = createAsyncThunk('watch/timestampFailed',
  async ({ caption }) => {
    promptControl.timestampFailed(caption.transcription.transcriptionType === 0);
  }
);

export const saveCaption = createAsyncThunk('watch/saveCaption',
  async ({ caption, text, begin, end }, { dispatch, getState }) => {
    const { watch } = getState();

    // console.log("Entering saveCaption with payload:", { caption, text, begin, end });
    // console.log("Current watch state:", watch);

    /**
     * @todo check PROFANITY_LIST
     */
    /**
     * @todo check begin overlap or other timestamp checks
     */

    // currEditing could be missing if captions are frozen
    // if (!text || !watch?.currEditing || (watch.currEditing && watch.currEditing.text === text && watch.currEditing.begin === begin)) {
    //     // console.log("Exiting saveCaption early. Conditions not met.");
    //     promptControl.closePrompt();
    //     return;
    //     // return this.edit(null); NOT IMPLEMENTED
    // }

    if (!text) {
      // console.log("Exiting saveCaption early: 'text' is falsy.");
      promptControl.closePrompt();
      return;
    }

    if (!watch?.currEditing) {
      // console.log("Exiting saveCaption early: 'watch.currEditing' is falsy.");
      promptControl.closePrompt();
      return;
    }

    if (watch.currEditing && watch.currEditing.text === text && watch.currEditing.begin === begin && watch.currEditing.end === end) {
      // console.log("Exiting saveCaption early: No changes detected in 'currEditing'.");
      promptControl.closePrompt();
      return;
    }

    // console.log("Updating caption with text:", text);
    caption.text = text; // update data model 
    caption.begin = begin;
    caption.end = end;
    promptControl.savingCaption(); // just a ui prompt, empty atm

    const { id } = watch.currEditing;
    // console.log("Sending user event with ID:", id, "Current time:", watch.currTime, "Old text:", watch.currEditing.text, "New text:", text);

    const isClosedCaption = caption.transcription.transcriptionType === 0;
    // console.log("Is closed caption:", isClosedCaption);

    dispatch({ type: 'watch/setCurrEditing', payload: null });

    try {
      // console.log("Calling API to update caption line with data:", { id, text, begin, end });
      await api.updateCaptionLine({ id, text, begin, end });

      if (isClosedCaption) {
        // console.log("Updating closed captions in state.");
        dispatch({ type: 'watch/setCaptions', payload: watch.captions });
      } else {
        // console.log("Updating descriptions in state.");
        dispatch({ type: 'watch/setDescriptions', payload: watch.descriptions });
      }
      // another elif here for chapter breaks eventually
      promptControl.savedCaption(isClosedCaption, true);
      // console.log("Caption saved successfully.");
    } catch (error) {
      console.error("Error saving caption:", error);
      promptControl.savedCaption(isClosedCaption, false);
    }
  }
);

export const setFontSize = createAsyncThunk('watch/setFontSize',
  async ({ fontSize }, { dispatch, getState }) => {
    const { watch } = getState();
    if (fontSize == null) {
      dispatch({ type: 'watch/setFontSizeReducer', payload: "normal" });
    } else if (fontSize === watch.fontSize) {
      // very good it has changed so stop calling yourself
    } else {
      dispatch({ type: 'watch/setFontSizeReducer', payload: fontSize });
    }
  }
);

export const allTransThunks = {
  setCurrTrans,
  setTranscriptions,
  updateTranscript,
  setLanguage,
  setCurrentTranscriptionMulti,
  setTransEditMode,
  timestampFailed,
  saveCaption,
  setFontSize
}