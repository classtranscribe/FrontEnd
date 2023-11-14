/* eslint-disable no-console */
/* eslint-disable complexity */

import { api } from 'utils';
import _ from 'lodash';
import { isMobile } from 'react-device-detect';
import {
    ENGLISH, ARRAY_EMPTY, WEBVTT_SUBTITLES, WEBVTT_DESCRIPTIONS,
    // WEBVTT_DESCRIPTIONS,
    // PROFANITY_LIST,
} from '../Utils/constants.util';
import { promptControl } from '../Utils/prompt.control';
import { timeStrToSec } from '../Utils/helpers';

import { uEvent } from '../Utils/UserEventController';
import { scrollTransToView, findTransByLanguages } from '../Utils'

/**
 * * Find subtitle based on current time
*/
const findCurrent = (array = [], prev = {}, now = 0, deterFunc) => {
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
    *setCurrTrans({ payload: trans }, { all, call, put}) {
        // Get and set corresponding captions
        if( !Array.isArray(trans) ) { trans = [trans]; }

        let alldata = ARRAY_EMPTY;
        if(trans.length >0) {
            // let {data = []} = yield api.getCaptionsByTranscriptionId(trans[0].id);
            // alldata = [...alldata, ...data];
            const allTranscriptionData = yield all(
                trans.map((tran) => call(api.getCaptionsByTranscriptionId, tran.id))
            );
            
            // Inplace add a reference to the transcription object for all captions
            allTranscriptionData.forEach((captionList, listIndex) =>{
                const tran = trans[listIndex];
                captionList.data?.forEach( (c) => {
                    c.tran = tran;
                  });
            });

            alldata = allTranscriptionData.reduce((acc, { data = [] }) => [...acc, ...data], []);
        }
        // eslint-disable-next-line no-console
        console.log(`*setCurrTrans ${alldata.length} captions`)

        let closedcaptions = alldata.filter((c)=>c.tran.transcriptionType === 0);
        let descriptions = alldata.filter((c)=>c.tran.transcriptionType !==0);

        yield put({ type: 'setCaptions', payload: closedcaptions });
        
        const descirptionsData = descriptions.map(caption => ({
            ...caption,
            end: caption.begin, // Set endTime to match beginTime. Why?
          }));
        yield put.resolve({ type: 'setDescriptions', payload: descirptionsData });
        yield put({ type: 'setTranscript' });
    },
    *setTranscriptions({ payload: trans }, { put}) {
        const selectedTrans = findTransByLanguages(trans, [ENGLISH]);
       
        for (const t of selectedTrans) {
            yield put({
                type: 'setCurrentTranscriptionMulti',
                payload: { halfKey: t.halfKey, active: true },
            });
        }
    },
    *updateTranscript({ payload: currentTime }, { put, select }) {
        // eslint-disable-next-line no-console
        const { watch, playerpref } = yield select();
        const prevCaption_ = watch.caption;
        if (watch.transcript === ARRAY_EMPTY) return null;
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
        }
        // console.log(watch)
        // console.log(`pauseWhileAD:${playerpref.pauseWhileAD}`);
        const nextDescription = findCurrentDescription(watch.descriptions, currentTime);
        if (nextDescription) {
            const nextDescriptionBeginTime = timeStrToSec(nextDescription.begin);
            if (Math.abs(currentTime - nextDescriptionBeginTime) <= 1) {
                if (playerpref.pauseWhileAD) {
                    yield put({ type: 'media_pause' });
                }
            // Speak out loud 
            console.log(`SPEAK ${nextDescription.text}`);
            // this.updateDescription(next);
            // prevDesc_ = nextDescription
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
       
        const selected = watch.currentTranscriptionMulti.halfKeysSelected
        
        const currTrans = watch.transcriptions.filter((t) => selected.includes(t.halfKey));
        
        if (currTrans.length > 0) {
            yield put({ type: 'setCurrTrans', payload: currTrans });
        }
        // TODO - fix uEvent
        // uEvent.langchange(watch.time, language);
        // uEvent.registerLanguage(language);
    },

    *setTransEditMode({ payload: { caption } }, { put, select }) {
        // if no param caption, edit current caption
        const { watch, playerpref } = yield select();
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
    *saveCaption({ payload: { caption, text } }, { call, put, select }) {
        const { watch } = yield select();
        /**
         * @todo check PROFANITY_LIST
         */
        if (!text || (watch.currEditing && watch.currEditing.text === text)) {
            promptControl.closePrompt();
            return;
            // return this.edit(null); NOT IMPLEMENTED
        }
        caption.text = text; // update data model 
        promptControl.savingCaption();

        const { id } = watch.currEditing;
        // send user event
        uEvent.edittrans(watch.currTime, watch.currEditing.text, text);
        // update new text
        // this.currEditing_.text = text; ?
        const isClosedCaption = caption.trans.transcriptionType === 0;

        yield put({ type: 'setCurrEditing', payload: null });
        try {
            yield call(api.updateCaptionLine, { id, text });
            if(isClosedCaption) {
                yield put({ type: 'setCaptions', payload: watch.captions });
            } else {
                yield put({ type: 'setDescriptions', payload: watch.descriptions });
            }
            promptControl.savedCaption(isClosedCaption, true);
        } catch (error) {
            promptControl.savedCaption(isClosedCaption, false);
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