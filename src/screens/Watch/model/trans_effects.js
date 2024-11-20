/* eslint-disable no-console */
/* eslint-disable complexity */

import { api } from 'utils';
import _ from 'lodash';
// import { isMobile } from 'react-device-detect';
import { /* CROWDEDIT_ALLOW, */CROWDEDIT_FREEZE_ALL } from 'utils/constants.js';
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

export default {

    // We have an array of transcript Ids to display, time to get the actual transcripts from the server
    *setCurrTrans({ payload: trans }, { all, call, put }) {
        console.log("Starting setCurrTrans with trans payload:", trans);
    
        // Ensure trans is an array
        if (!Array.isArray(trans)) { 
            trans = [trans]; 
        }
        console.log("Normalized trans array:", trans); 
    
        let alldata;
        if (trans.length > 0) {
            console.log("Fetching captions for each transcription ID...");
            
            // Fetch data for each transcription ID
            const allTranscriptionData = yield all(
                trans.map((tran) => call(api.getCaptionsByTranscriptionId, tran.id))
            );
            console.log("Fetched allTranscriptionData:", allTranscriptionData);
    
            // Attach transcription reference to each caption
            allTranscriptionData.forEach((captionList, listIndex) => {
                const t = trans[listIndex];
                captionList.data?.forEach((c) => {
                    c.transcription = t;
                    console.log(`Assigned transcription for caption (ID: ${c.id}):`, c.transcription);
                });
            });
    
            // Merge all caption data into alldata
            alldata = allTranscriptionData.reduce((acc, { data = [] }) => [...acc, ...data], []);
            console.log("Combined alldata:", alldata); 
        }
    
        if (alldata === undefined) { 
            alldata = []; 
        }
    
        // Filter captions by transcription type
        let closedcaptions = alldata.filter((c) => c.transcription.transcriptionType === 0);
        let descriptions = alldata.filter((c) => c.transcription.transcriptionType !== 0);
        console.log("Filtered closedcaptions:", closedcaptions);
        console.log("Filtered descriptions:", descriptions);    
    
        // Dispatch closed captions
        yield put({ type: 'setCaptions', payload: closedcaptions });
        
        // Dispatch descriptions
        const descriptionData = descriptions;
        console.log("Dispatching descriptionData:", descriptionData);
        yield put.resolve({ type: 'setDescriptions', payload: descriptionData });
        
        // Dispatch final transcript set
        yield put({ type: 'setTranscript' });
        console.log("Completed setCurrTrans");
    },
    
    *setTranscriptions({ payload: trans }, { put, select}) {
        const { playerpref } = yield select();
        let keys = playerpref.transKeys ;
        if( keys === undefined ) {
            // No preference, so look for 1 caption and 1 description... 
            const seen = new Set();
            keys = [];
            for (const t of trans) {
                if(! seen.has(t.transcriptionType)) {
                    keys.push(t.transKey);
                    seen.add(t.transcriptionType);
                }
            }
            // if(keys.length === 0 && trans.length > 0) {
            yield put({
                type: 'playerpref/setPreference', payload: { transKeys: keys }
            });
        }
        for (const t of keys) {
            yield put({
                type: 'setCurrentTranscriptionMulti',
                payload: { transKey: t, active: true },
            });
        }
    },
    *updateTranscript({ payload: currentTime }, { put, select }) {
        const { watch, playerpref } = yield select();
        const prevCaption_ = watch.caption;
        // TODO: Fix: if watch.transcript is ARRAY_EMPTY (?) or length 0 then findCurrent will 
        // return with the current transcript. Should put({ type: 'setCurrCaption', payload: null
        
        // TODO: is index reset in frontend? the findCurrent assumes index are increasing integers
        // Ans: Yes in model.js/setTranscript, after filtering wanted transcriptions -
        // "transcript= _.map(transcript, (item, index) => ({ ...item, index }));
    

        const next = findCurrent(watch.transcript, prevCaption_, currentTime);
        if (next && next.id) {
            // console.log(next);
            // pause video if it's AD
            
            // determine whether should scroll smoothly
            const smoothScroll =
                prevCaption_ && next && Math.abs(prevCaption_.index - next.index) === 1;
            yield put({ type: 'setCurrCaption', payload: next });

            if (playerpref.autoScroll && !watch.mouseOnCaption && !watch.currEditing) {
                const { media = {} } = watch;
                scrollTransToView(next.id, smoothScroll, media.isTwoScreen);
            }
        } else {
            yield put({ type: 'setCurrCaption', payload: null });
        }
        // console.log(watch)
        // console.log(`pauseWhileAD:${playerpref.pauseWhileAD}`);
        const nextDescription = findCurrentDescription(watch.descriptions, currentTime);
        if (playerpref.openAD && nextDescription) {
            const nextDescriptionBeginTime = timeStrToSec(nextDescription.begin);
            if (Math.abs(currentTime - nextDescriptionBeginTime) <= 1) {
                if (playerpref.pauseWhileAD) {
                    yield put({ type: 'media_pause' });
                }
                // Speak out loud 
                console.log(`SPEAK ${nextDescription.text}`);
                yield put({ type: 'playerpref/setPreference', payload: { description: nextDescription.text } }) 
            }
        }
        return next || null;
        // transControl.updateTranscript(currentTime);
    },
    *setLanguage({ payload: language }, { put, select }) {
        const { watch } = yield select();
        const currTrans = findTransByLanguages(watch.transcriptions,[language]);
        if (currTrans) {
            yield put({ type: 'setCurrTrans', payload: currTrans });
        }
        uEvent.langchange(watch.time, language);
        uEvent.registerLanguage(language);
    },
    *setCurrentTranscriptionMulti( _ignore, { put, select }) {
        const { watch } = yield select();
       
        const selected = watch.currentTranscriptionMulti.transKeysSelected
        
        const currTrans = watch.transcriptions.filter((t) => selected.includes(t.transKey));
        
        // if (currTrans.length > 0) {
        yield put({ type: 'setCurrTrans', payload: currTrans });
        // }
        const currKeys = currTrans.map((t) => t.transKey);
        // remember preference for next time
        yield put({ type: 'playerpref/setPreference', payload: { transKeys: currKeys } });
        // TODO - fix uEvent
        // uEvent.langchange(watch.time, language);
        // uEvent.registerLanguage(language);
    },

    *setTransEditMode({ payload: { caption } }, { put, select }) {
        // if no param caption, edit current caption
        const { watch, playerpref } = yield select();
        
        const media = watch.media;
        const crowdEdit = media.crowdEditMode !== CROWDEDIT_FREEZE_ALL;
        if (! crowdEdit) {
            return;
        }

        const currCap = caption || watch.currCaption_;
        yield put({ type: 'setCurrEditing', payload: currCap });
        if (playerpref.pauseWhileEditing) {
            yield put({ type: 'media_pause' });
        }
        if (playerpref.showCaptionTips) {
            promptControl.editCaptionTips();
            yield put({ type: 'playerpref/setPreference', payload: { showCaptionTips: false } });
        }
    },
    // This is a transcript caption
    *saveCaption({ payload: { caption, text, begin, end } }, { call, put, select }) {
        const { watch } = yield select();
    
        console.log("Entering saveCaption with payload:", { caption, text, begin, end });
        console.log("Current watch state:", watch);
    
        /**
         * @todo check PROFANITY_LIST
         */
        /**
         * @todo check begin overlap or other timestamp checks
         */
    
        // currEditing could be missing if captions are frozen
        // if (!text || !watch?.currEditing || (watch.currEditing && watch.currEditing.text === text && watch.currEditing.begin === begin)) {
        //     console.log("Exiting saveCaption early. Conditions not met.");
        //     promptControl.closePrompt();
        //     return;
        //     // return this.edit(null); NOT IMPLEMENTED
        // }

        if (!text) {
            console.log("Exiting saveCaption early: 'text' is falsy.");
            promptControl.closePrompt();
            return;
        }
        
        if (!watch?.currEditing) {
            console.log("Exiting saveCaption early: 'watch.currEditing' is falsy.");
            promptControl.closePrompt();
            return;
        }
        
        if (watch.currEditing && watch.currEditing.text === text && watch.currEditing.begin === begin && watch.currEditing.end === end) {
            console.log("Exiting saveCaption early: No changes detected in 'currEditing'.");
            promptControl.closePrompt();
            return;
        }        
    
        console.log("Updating caption with text:", text);
        caption.text = text; // update data model 
        caption.begin = begin;        
        caption.end = end;
        promptControl.savingCaption(); // just a ui prompt, empty atm
    
        const { id } = watch.currEditing;
        console.log("Sending user event with ID:", id, "Current time:", watch.currTime, "Old text:", watch.currEditing.text, "New text:", text);
        
        const isClosedCaption = caption.transcription.transcriptionType === 0; 
        console.log("Is closed caption:", isClosedCaption);
    
        yield put({ type: 'setCurrEditing', payload: null });
    
        try {
            console.log("Calling API to update caption line with data:", { id, text, begin, end });
            console.log("caption.id is", caption.id);
            const response = yield call(api.updateCaptionLine, { id, text, begin, end });
            const updatedCaption = response.data;
            console.log("updated caption", updatedCaption);
            if (caption.id !== updatedCaption.id) {
                yield put({ type: 'replaceCaptionId', payload: { tempId: caption.id, newId: updatedCaption.id } });
            }
            // if (isClosedCaption) {
            //     console.log("Updating closed captions in state.");
            //     yield put({ type: 'setCaptions', payload: watch.captions });
            // } else {
            //     console.log("Updating descriptions in state.");
            //     yield put({ type: 'setDescriptions', payload: watch.descriptions });
            // }
            yield put({ type: 'updateCaption', payload: updatedCaption });
            yield put({ type: 'setTranscript' });
            // another elif here for chapter breaks eventually
            promptControl.savedCaption(isClosedCaption, true);
            console.log("Caption saved successfully.");
        } catch (error) {
            console.error("Error saving caption:", error);
            promptControl.savedCaption(isClosedCaption, false);
        }
    },
    *addCaption({ payload: captionData }, { call, put, select }) {
        try {
            const { watch } = yield select();
            const { transcriptions } = watch;
            const transcription = transcriptions.find(t => t.transcriptionType === captionData.captionType);
            if (!transcription) {
                console.error('Transcription not found for', captionData.captionType);
                return;
            }
            captionData.transcriptionId = transcription.id;
            const response = yield call(api.addCaption, captionData);
            const addedCaption = response.data;
            console.log("caption from backend", response.data);
            yield put({ type: 'addCaptionToTranscript', payload: addedCaption });
            yield put({ type: 'sortTranscript' });
            yield put({ type: 'setTranscript' });
        } catch (error) {
            console.error("Error adding caption:", error);
        }
    },
    *setFontSize({ payload: fontSize }, { put, select }) {
        const { watch } = yield select();
        if (fontSize == null) {
            yield put({ type: 'setFontSize', payload: "normal" });
        } else if (fontSize === watch.fontSize) {
            // very good it has changed so stop calling yourself
        } else {
            yield put({ type: 'setFontSize', payload: fontSize });
        }
    },
}