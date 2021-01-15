
import {
    ERR_INVALID_MEDIA_ID, ERR_AUTH, ENGLISH, ARRAY_EMPTY, HIDE_TRANS, CC_COLOR_WHITE,
    CC_COLOR_BLACK,
    CC_OPACITY_75,
    CC_POSITION_BOTTOM,
    CC_FONT_SANS_SERIF,
    CC_SIZE_100,
    WEBVTT_SUBTITLES,
    WEBVTT_DESCRIPTIONS,
    // PROFANITY_LIST,
    TRANSCRIPT_VIEW,
    LINE_VIEW,
    CO_CHANGE_VIDEO,
    BULK_EDIT_MODE,
} from '../Utils/constants.util';
import { timeStrToSec, colorMap } from '../Utils/helpers';
import { api } from 'utils';
import _ from 'lodash';
import { uEvent } from '../Utils/UserEventController';
import { isMobile } from 'react-device-detect';
import { findTransByLanguage } from '../Utils'
/**
* Function that scrolls the captions

const scrollTransToView = (id, smoothScroll = true) => {
    if (this.isMourseOverTrans || this.isEditing) return;
    let capId = id;
    if (id === undefined && Boolean(this.currTrans_)) {
        capId = this.currTrans_.id;
    }
    if (!capId) return;
    const capElem = document.getElementById(`caption-line-${capId}`);
    if (!capElem || !capElem.offsetTop) return;

    const tranBox = document.getElementById('watch-trans-container');
    const isTwoScreen = videoControl.isTwoScreen();

    const shouldSmoothScroll = smoothScroll && tranBox.scrollTop - capElem.offsetTop < 0;

    if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'auto';
    capElem.classList.add('curr-line');
    const scrollTop =
        window.innerWidth < 900 || !isTwoScreen ? capElem.offsetTop - 50 : capElem.offsetTop - 80;
    // if (preferControl.defaultTransView() === TRANSCRIPT_VIEW) scrollTop -= 400
    tranBox.scrollTop = scrollTop;
    if (!shouldSmoothScroll) tranBox.style.scrollBehavior = 'smooth';
}
*/

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
        const { watch } = yield select();
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
            /* NOT IMPLEMENTED
            if (preferControl.autoScroll()) {
                this.scrollTransToView(next.id, smoothScroll);
            }
            */
        }
        return next || null;
        // transControl.updateTranscript(currentTime);
    },
    *setLanguage({ payload : language }, { call, put, select, take }) {
        const { watch } = yield select();
        const currTrans = findTransByLanguage(language, watch.transcriptions);
        if (currTrans) {
            yield put({ type: 'setCurrTrans', payload: currTrans });
        }
        uEvent.langchange(watch.time, language);
        uEvent.registerLanguage(language);
    },
    *toggleOpenAD({ payload }, { call, put, select, take }) {
        // preferControl.ad(bool);
    },
    *toggleOpenCC({ payload }, { call, put, select, take }) {
        // preferControl.cc(bool);
    },
    *updateTranscript_v09({ payload }, { call, put, select, take }) {

    }
}