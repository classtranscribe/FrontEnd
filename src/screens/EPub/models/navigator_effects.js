import _ from 'lodash';
import { elem } from 'utils';
import ID from '../controllers/constants/EPubIDs';
import Constants from '../controllers/constants/EPubConstants';

function getChTop(id, view) {
    try {
        const chId = view === Constants.EpbReadOnly ? id : ID.chID(id);
        const chEl = elem.getElement(chId);
        return chEl.offsetTop;
    } catch {
        return 0;
    }
}
function getSubChTop(epub, id, view, offset = 75) {
    const schId = view === Constants.EpbReadOnly ? id : ID.schID(id);
    const schEl = elem.getElement(schId);
    if (!schEl) {
        return 10000;
    }
    const schUlEl = schEl.parentElement;
    const chEl = schUlEl.parentElement;
    if (epub.view === Constants.EpbEditStructure) {
        return schEl.offsetTop + schUlEl.offsetTop + chEl.offsetTop - offset;
    }
    return schEl.offsetTop - offset;
}
function scrollToSubCh(epub, id) {
    try {
        const chListEl = elem.getElement(ID.EPubChapterListID);
        chListEl.scrollTop = getSubChTop(epub, id, epub.view);
    } catch {
        // 
    }
}
function scrollToCh(id, view) {
    try {
        const chListEl = elem.getElement(ID.EPubChapterListID);
        chListEl.scrollTop = getChTop(id, view);
    } catch {
        // 
    }
}
function* updateNavIdForEpbEditStructure(e, epub, put) {
    const chElScrollTop = e.scrollTop;
    // handle abnormal cases when scroll to top
    if (chElScrollTop < 10 && epub.epub.chapters.length > 0) {
        yield put({ type: 'setNavId', payload: ID.chNavItemID(epub.epub.chapters[0].id) })
        yield put({ type: 'setCurrChIndex', payload: 0 })
        return;
    }

    // initialize default values
    let navId = epub.navId;
    let currChIndex = epub.currChIndex;
    let minDis = 1000;

    // iterate all possible chapters and sub-chapters 
    // to find the current one in view
    yield _.forEach(epub.epub.chapters, async (ch, chIdx) => {
        const chTop = getChTop(ch.id, epub.view);
        const chDis = chElScrollTop - chTop + 90;
        if (chDis < 0) return false; // stop iterate when exceed the scrollTop
        if (chDis > 0 && chDis < minDis) {
            minDis = chDis;
            navId = ID.chNavItemID(ch.id);
            currChIndex = chIdx;
        }

        await _.forEach(ch.subChapters, (sch) => {
            const schTop = getSubChTop(epub, sch.id, epub.view);
            const schDis = chElScrollTop - schTop + 50;
            if (schDis < 0) return false; // stop iterate when exceed the scrollTop
            if (schDis > 0 && schDis < minDis) {
                minDis = schDis;
                navId = ID.schNavItemID(sch.id);
                currChIndex = chIdx;
            }
        });
    });
    yield put({ type: 'setNavId', payload: navId })
    yield put({ type: 'setCurrChIndex', payload: currChIndex })
}
function* updateNavIdForEditChaper(e, epub, put) {
    const chElScrollTop = e.scrollTop;
    const chIdx = epub.currChIndex;
    const chapter = epub.epub.chapters[chIdx];
    if (chElScrollTop < 40) {
        yield put({ type: 'setNavId', payload: ID.chNavItemID(chapter.id) })
    }

    // initialize default values
    let navId = epub.navId;
    let minDis = 1000;

    yield _.forEach(chapter.subChapters, (sch) => {
        const schTop = getSubChTop(epub, sch.id);
        const schDis = chElScrollTop - schTop + 50;
        if (schDis < 0) return false; // stop iterate when exceed the scrollTop
        if (schDis > 0 && schDis < minDis) {
            minDis = schDis;
            navId = ID.schNavItemID(sch.id);
        }
    });
    yield put({ type: 'setNavId', payload: navId })
}

export default {
    onScroll: [
        function* ({ payload: e }, { call, put, select, take }) {
            const { epub } = yield select();
            switch (epub.view) {
                case Constants.EpbEditStructure:
                    yield call(updateNavIdForEpbEditStructure, e, epub, put);
                    break;
                case Constants.EpbEditChapter:
                    yield call(updateNavIdForEditChaper, e, epub, put);
                    break;
                case Constants.EpbReadOnly:
                    yield call(updateNavIdForEpbEditStructure, e, epub, put);
                    break;
                case Constants.EditINote:
                    yield call(updateNavIdForEpbEditStructure, e, epub, put);
                    break;
                default:
                    break;
            }
        },
        // { type: 'throttle', ms: 1000 }
    ],
    *navigateSubChapter({ payload }, { select, put }) {
        const { epub } = yield select();
        yield put({
            type: 'setNavId',
            payload: epub.state === Constants.EpbReadOnly ? payload : ID.schNavItemID(payload)
        });
        yield scrollToSubCh(epub, payload)
    },
    *navigateChapter({ payload: chId }, { call, put, select, take }) {
        const { epub } = yield select();
        if (epub.view === Constants.EpbEditChapter) {
            let chIdx = _.findIndex(epub.epub.chapters, { id: chId });
            if (chIdx < 0) return;
            elem.scrollToTop(ID.EPubChapterListID);
            if (chIdx !== epub.currChIndex) {
                yield put({ type: 'setCurrChIndex', payload: chIdx });
            }
            yield put({ type: 'setNavId', payload: ID.chNavItemID(chId) });
            elem.scrollToTop(ID.EPubChapterListID);
        } else {
            scrollToCh(chId, epub.view);
        }
    },
}