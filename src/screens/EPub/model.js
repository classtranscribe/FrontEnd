import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError, links, uurl, elem, timestr } from 'utils';
import { delay } from 'dva/saga'
import pathToRegexp from 'path-to-regexp';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import ErrorTypes from 'entities/ErrorTypes';
import SourceTypes from 'entities/SourceTypes';
import { EPubData } from 'entities/EPubs';
import { getAllItemsInChapters } from 'entities/EPubs/utils'
import Constants from './controllers/constants/EPubConstants'
import { getEPubById, getMediaById } from './service'
import model_data_reducer from './models/data_reducer'
import model_nav_effects from './models/navigator_effects'

const initState = {
    error: null,
    media: null,
    view: Constants.EpbDefaultView,
    epub: null,
    currChIndex: 0,
    foldedIds: [],
    saved: Constants.EpbSaved,
    navId: null,
    showNav: true,
    imgPickerData: null,
    playerData: null,
    showPreview: false,
    showFileSettings: false,
    showPrefSettings: false,
    showShortcuts: false,
    images: null
}
const EPubModel = {
    namespace: 'epub',
    state: { ...initState },
    reducers: {

        setError(state, { payload }) {
            return { ...state, error: payload };
        },
        setView(state, { payload }) {
            return {
                ...state,
                view: payload,
                showNav: true,
                showPreview: false,
                // navId: null,
                currChIndex: payload === Constants.EpbReadOnly ? 0 : state.currChIndex
            };
        },
        setMedia(state, { payload }) {
            return { ...state, media: payload };
        },
        setEPub(state, { payload }) {
            const items = getAllItemsInChapters(payload.chapters);
            if (!payload.chapters) {
                payload.chapters = []
            }
            return { ...state, epub: payload, items, images: _.map(items, item => item?.image) };
        },
        setCurrChIndex(state, { payload }) {
            return { ...state, currChIndex: payload };
        },
        setFoldedIds(state, { payload }) {
            return { ...state, foldedIds: payload };
        },
        foldChapter(state, { payload: { folded, id } }) {
            return {
                ...state,
                foldedIds: folded ? [...state.foldedIds, id] : _.filter(state.foldedIds, (fid) => fid !== id)
            }
        },
        setSaved(state, { payload }) {
            return { ...state, saved: payload };
        },

        setNavId(state, { payload }) {
            return { ...state, navId: payload };
        },
        setShowNav(state, { payload }) {
            return { ...state, showNav: payload };
        },
        toggleNav(state) {
            return { ...state, showNav: !state.showNav }
        },
        setImgPickerData(state, { payload }) {
            return { ...state, imgPickerData: payload };
        },
        setPlayerData(state, { payload }) {
            return { ...state, playerData: payload };
        },
        setShowPreview(state, { payload }) {
            return { ...state, showPreview: payload };
        },
        togglePreview(state) {
            return { ...state, showPreview: !state.showPreview }
        },
        setShowFileSettings(state, { payload }) {
            return { ...state, showFileSettings: payload };
        },
        setShowPrefSettings(state, { payload }) {
            return { ...state, showPrefSettings: payload };
        },
        setShowShortcuts(state, { payload }) {
            return { ...state, showShortcuts: payload };
        },
        toggleShortcuts(state) {
            return { ...state, showShortcuts: !state.showShortcuts }
        },
        resetStates(state, { payload }) {
            return { ...initState };
        },
        ...model_data_reducer
    },
    effects: {
        *setupEPub({ payload: ePubId }, { call, put, select, take }) {
            /*
            if (this.ePubId === ePubId) {
                epubState.resetStates();
                return;
            }
            */
            let _epub = yield call(getEPubById, ePubId);

            const { view, h } = uurl.useHash();
            if (Constants.EPubViews.includes(view)) {
                yield put({ type: 'setView', payload: view });
            }

            if (h) {
                elem.scrollIntoView(h);
            }

            api.contentLoaded(100);

            if (ErrorTypes.isError(_epub)) {
                prompt.error('Failed to load I-Note data.', 5000);
                return;
            }
            yield put({ type: 'setEPub', payload: _epub });

            links.title(_epub.title);

            if (_epub.sourceType === SourceTypes.Media) {
                const media = yield call(getMediaById, _epub.sourceId);
                yield put({ type: 'setMedia', payload: media });
            }
            // split chapter by screenshots on create (default of 25 min word count)
            // yield put({type: 'epub/splitChaptersByScreenshots', payload:{wc: 25}});
        },
        *openPlayer({ payload: { title, start, end } }, { call, put, select, take }) {
            const { epub } = yield select();
            if (!epub.media) return;
            yield put({
                type: 'setPlayerData', payload: {
                    title,
                    begin: timestr.toSeconds(start),
                    end: timestr.toSeconds(end)
                }
            });
        },
        *duplicateEPub({ payload: { newData, copyChapterStructure } }, { call, put, select, take }) {
            prompt.addOne({ text: 'Copying I-Note data...', timeout: 4000 });
            const { epub } = yield select();
            const oldData = epub.epub;
            const newLanguage = newData.language;
            const isDifferentLanguage = newLanguage !== epub.epub.language;
            if (!newData.chapters) {
                newData.chapters = epub.epub.chapters;
            }

            if (isDifferentLanguage) {
                const rawEPubData = yield EPubListCtrl.getRawEPubData(
                    oldData.sourceType, oldData.sourceId, newLanguage
                );

                newData = EPubData.create(rawEPubData, newData, copyChapterStructure).toObject();
            }

            delete newData.id;

            const newEPubData = yield call(EPubListCtrl.postEPubData, newData);
            if (!newEPubData) {
                prompt.error('Failed to create the I-Note.');
                return;
            }

            uurl.openNewTab(links.epub(newEPubData.id, Constants.EditINote));
        },
        *deleteEPub({ payload: ePubId }, { call, put, select, take }) {
            try {
                yield call(api.deleteEPub, ePubId);
                window.close();
            } catch (error) {
                console.error(error);
                prompt.error('Failed to delete the I-Note.');
            }
        },
        *updateEPubBasicInfo({ payload }, { put }) {
            yield put.resolve({ type: 'setEPub', payload })
            yield put({ type: 'updateEPub', payload: 0 })
        },
        // Debounce
        updateEPub: [
            function* ({ payload: timeout = 3000 }, { put }) {
                yield delay(timeout);
                yield put({ type: 'updateEPub_Internal' })
            },
            { type: "takeLatest" }
        ],
        *updateEPub_Internal(action, { call, put, select, take }) {
            yield put.resolve({ type: 'setSaved', payload: (Constants.EpbSaving) });
            const { epub } = yield select();
            try {
                yield call(api.updateEPub, epub.epub);
                yield put({ type: 'setSaved', payload: (Constants.EpbSaved) });
                /*
                if (this.__notifyOnce) {
                    this.__notifyOnce = false;
                    prompt.addOne({ status: 'success', text: 'Saved!', timeout: 4000 });
                }
                */ // NOT IMPLEMENTED
            } catch (error) {
                prompt.error('Failed to update I-Note');
                yield put({ type: 'setSaved', payload: (Constants.EpbSaveFailed) });
            }
        },
        *updateEpubData({ payload: { action, payload } }, { call, put, select, take }) {
            yield put.resolve({ type: action, payload })
            yield put({ type: 'updateEPub' })
        },
        *splitChaptersByScreenshots({ payload: {wc} }, { call, put, select, take }) {
            prompt.addOne({
                text: 'Split chapters by screenshots.',
                position: 'left bottom',
                timeout: 2000,
            });
            yield put({ type: 'updateEPub' })
        },
        *resetToDefaultChapters({ payload }, { call, put, select, take }) {
            // this.updateAll('Reset to the default chapters', 0);
            prompt.addOne({
                text: 'Reset to the default chapters.',
                position: 'left bottom',
                timeout: 2000,
            });
            yield put({ type: 'updateEPub' })
        },
        ...model_nav_effects
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                const pathname = event.pathname ? event.pathname : event.location?.pathname
                const match = pathToRegexp('/epub/:id/:option?').exec(pathname);
                if (match) {
                    dispatch({ type: 'setupEPub', payload: match[1] });
                }
            })
        }
    }
}
export default EPubModel