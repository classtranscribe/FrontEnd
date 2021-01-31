
import { api } from 'utils';
import _ from 'lodash';
import { isMobile } from 'react-device-detect';
import {
    ENGLISH, ARRAY_EMPTY,
    WEBVTT_DESCRIPTIONS,
    // PROFANITY_LIST,
} from '../Utils/constants.util';
import { timeStrToSec, colorMap } from '../Utils/helpers';

import { uEvent } from '../Utils/UserEventController';
import { findTransByLanguage, scrollTransToView } from '../Utils'

/**
 * * Find item based on current time
*/
const findCurrent = (array = [], prev = {}, now = 0, deterFunc) => {
    let next = prev;
    const isCurrent = (item) => {
        if (!item) return false;
        const end = timeStrToSec(item.end);
        const begin = timeStrToSec(item.begin);
        let deter = true;
        if (deterFunc) deter = deterFunc(item, prev);
        return begin <= now && now <= end && deter;
    };
    // if (isCurrent(prev)) {
    //   next = prev
    // }

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

    // if (next) { this.prev = next; } NOT IMPLEMENTED
    // if (next) console.error(next.kind)
    // else console.error('null')
    return next;
}
export default {
    *setCurrTrans({ payload: tran }, { call, put, select, take }) {
        // Get and set corresponding captions
        const { data = [] } = yield call(api.getCaptionsByTranscriptionId, tran.id);
        yield put.resolve({ type: 'setCaptions', payload: data });
        const descriptions = []; // adSample // need to modify
        yield put.resolve({ type: 'setDescriptions', payload: descriptions });
        yield put({ type: 'setTranscript' });
    },
    *setTranscriptions({ payload: trans }, { call, put, select, take }) {
        const currTrans = findTransByLanguage(ENGLISH, trans);
        uEvent.registerLanguage(ENGLISH);
        if (currTrans) {
            yield put({ type: 'setCurrTrans', payload: currTrans });
        } else {
            yield put({ type: 'setTranscript', payload: ARRAY_EMPTY });
            if (!isMobile) {
                // this.transView(HIDE_TRANS, { updatePrefer: false });
            }
        }
    },
    *updateTranscript({ payload: currentTime }, { call, put, select, take }) {
        const nextCaption = {};
        const { watch, playerpref } = yield select();
        const prevCaption_ = watch.caption;
        if (watch.transcript === ARRAY_EMPTY) return null;
        const next = findCurrent(watch.transcript, prevCaption_, currentTime);
        if (next && next.id) {
            // pause video if it's AD
            if (next.kind === WEBVTT_DESCRIPTIONS) {
                this.updateDescription(next);
                // if (preferControl.pauseWhileAD() && this.prevCaption_ !== next) videoControl.pause(); NOT IMPLEMNTED
            }

            // determine whether should scroll smoothly
            const smoothScroll =
                prevCaption_ && next && Math.abs(prevCaption_.index - next.index) === 1;
            yield put({ type: 'setCurrCaption', payload: next });

            if (playerpref.autoScroll) {
                const { media = {} } = watch;
                scrollTransToView(next.id, smoothScroll, media.isTwoScreen);
            }
        }
        return next || null;
        // transControl.updateTranscript(currentTime);
    },
    *setLanguage({ payload: language }, { call, put, select, take }) {
        const { watch } = yield select();
        const currTrans = findTransByLanguage(language, watch.transcriptions);
        if (currTrans) {
            yield put({ type: 'setCurrTrans', payload: currTrans });
        }
        uEvent.langchange(watch.time, language);
        uEvent.registerLanguage(language);
    }
}