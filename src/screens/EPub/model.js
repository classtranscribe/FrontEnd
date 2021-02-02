import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError, links, uurl, elem, timestr } from 'utils';
import pathToRegexp from 'path-to-regexp';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import ErrorTypes from 'entities/ErrorTypes';
import SourceTypes from 'entities/SourceTypes';
import { EPubData } from 'entities/EPubs';
import { epubData } from './controllers/EPubDataController';
import { shortcut } from './controllers/ShortcutController';
import Constants from './controllers/constants/EPubConstants'
import ID from './controllers/constants/EPubIDs';
import { getEPubById, getMediaById } from './service'
import { epub as ePubTemp } from './controllers';

const initState = {
    error: null,
    media: null,
    view: Constants.EpbDefaultView,
    epub: null,
    chapters: ARRAY_INIT,
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
    showShortcuts: false
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
            return { ...state, epub: payload };
        },
        setChapters(state, { payload }) {
            return { ...state, chapters: payload };
        },
        setCurrChIndex(state, { payload }) {
            return { ...state, currChIndex: payload };
        },
        setFoldedIds(state, { payload }) {
            return { ...state, foldedIds: payload };
        },
        foldChapter(state, { payload: { folded, id } }) {
            return { ...state, 
                foldedIds: folded ? [...state.foldedIds, id] : _.filter(state.foldedIds, (fid) => fid !== id) }
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

        setImgPickerData(state, { payload }) {
            return { ...state, imgPickerData: payload };
        },
        setPlayerData(state, { payload }) {
            return { ...state, playerData: payload };
        },
        setShowPreview(state, { payload }) {
            return { ...state, showPreview: payload };
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
        resetStates(state, { payload }) {
            return { ...initState };
        },
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
            // console.log('-----epub', _epub);
            // Parse epub data
            _epub = epubData.initEPubData(_epub);
            const chapters = _epub.chapters;
            delete _epub.chapters;
            yield put({ type: 'setEPub', payload: _epub });
            yield put({ type: 'setChapters', payload: chapters });

            const { view, h } = uurl.useHash();
            if (Constants.EPubViews.includes(view)) {
                yield put({ type: 'setView', payload: view });
            }

            if (h) {
                elem.scrollIntoView(h);
            }

            api.contentLoaded(100);

            if (ErrorTypes.isError(_epub)) {
                prompt.error('Failed to load ePub data.', 5000);
                return;
            }

            links.title(_epub.title);

            if (_epub.sourceType === SourceTypes.Media) {
                const media = yield call(getMediaById, _epub.sourceId);
                yield put({ type: 'setMedia', payload: media });
            }

            shortcut.addKeydownListener();
        },
        *openPlayer({ payload: { title, begin, end } }, { call, put, select, take }) {
            const { epub } = yield select();
            if (!epub.media) return;
            yield put({
                type: 'setPlayerData', payload: {
                    title,
                    begin: timestr.toSeconds(begin),
                    end: timestr.toSeconds(end)
                }
            });
        },
        *navigateChapter({ payload: chId }, { call, put, select, take }) {
            const { epub } = yield select();
            if (epub.view === Constants.EpbEditChapter) {
                let chIdx = _.findIndex(epub.chapters, { id: chId });
                if (chIdx < 0) return;
                elem.scrollToTop(ID.EPubChapterListID);
                if (chIdx !== epub.currChIndex) {
                    yield put({ type: 'setCurrChIndex', payload: chIdx });
                }
                yield put({ type: 'setNavId', payload: ID.chNavItemID(chId) });
                elem.scrollToTop(ID.EPubChapterListID);
            } else {
                ePubTemp.nav.scrollToCh(chId, epub.view);
            }
        },
        *duplicateEPub({ payload: { newData, copyChapterStructure } }, { call, put, select, take }) {
            prompt.addOne({ text: 'Copying ePub data...', timeout: 4000 });
            const { epub } = yield select();
            const oldData = epub.epub;
            const newLanguage = newData.language;
            const isDifferentLanguage = newLanguage !== epub.epub.language;
            if (!newData.chapters) {
                newData.chapters = epub.chapters;
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
                prompt.error('Failed to create the ePub.');
                return;
            }

            uurl.openNewTab(links.epub(newEPubData.id, Constants.EpbEditStructure));
        },
        *deleteEPub({ payload: ePubId }, { call, put, select, take }) {
            try {
                yield call(api.deleteEPub, ePubId);
                window.close();
            } catch (error) {
                console.error(error);
                prompt.error('Failed to delete the ePub.');
            }
        }
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