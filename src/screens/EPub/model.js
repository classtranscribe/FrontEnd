import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import Constants from './controllers/constants/EPubConstants'
import { api, user, prompt, InvalidDataError } from 'utils';
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
    state: {...initState},
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
            return {...initState};
        },
    },
    effects: {
        *setupWatchHistories({ payload }, { call, put, select, take }) {
            try {
                let { data } = yield call(api.getUserWatchHistories)
                yield put({ type: 'setWatchHistories', payload: data.filter(media => media && media.id) })
            } catch (error) {
                prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
            }
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            document.addEventListener('readystatechange', e => {
                if (document.readyState == "complete") {
                    dispatch({ type: 'setupWatchHistories' });
                }
            });
        }
    }
}
export default EPubModel