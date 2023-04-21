import { isMobile } from 'react-device-detect';
import {
    // constants
    CC_COLOR_WHITE,
    CC_COLOR_BLACK,
    CC_SIZE_100,
    CC_SIZE_75,
    CC_FONT_SANS_SERIF,
    CC_OPACITY_75,
    CC_SPACING_DEFAULT,
    CC_POSITION_BOTTOM,
    SCREEN_OPACITY_100,
    SCREEN_CONTRAST_100,
    SCREEN_ZOOM_100,
    ROTATE_COLOR_0,
    INVERT_0,

    scrollTransToView
} from './Utils';
import { uEvent } from './Utils/UserEventController';
import { LINE_VIEW, TRANSCRIPT_VIEW, SEARCH_TRANS_IN_VIDEO } from './Utils/constants.util';

function storageAvailable(type) {
    let storage;
    try {
        storage = window[type];
        let x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}
const storageAvailablity = storageAvailable('localStorage');
function updateLocalStorage(playerpref) {
    if (storageAvailablity) {
        localStorage.setItem('CT_preference', JSON.stringify(playerpref));
    }
}
const PlayerModel = {
    namespace: 'playerpref',
    state: {
        // Video player options
        volume: 1,
        muted: false,
        playbackrate: 1, // NOT PERMENENT STORAGE

        // CC options
        cc_color: CC_COLOR_WHITE,
        cc_bg: CC_COLOR_BLACK,
        cc_size: isMobile ? CC_SIZE_75 : CC_SIZE_100,
        cc_font: CC_FONT_SANS_SERIF,
        cc_position: CC_POSITION_BOTTOM,
        cc_opacity: CC_OPACITY_75,
        cc_spacing: CC_SPACING_DEFAULT,


        transView: isMobile ? TRANSCRIPT_VIEW : LINE_VIEW,

        openCC: true,
        openAD: false,

        autoPlay: !isMobile,
        brightness: SCREEN_OPACITY_100,
        contrast: SCREEN_CONTRAST_100,
        rotateColor: ROTATE_COLOR_0,
        invert: INVERT_0,
        scale: SCREEN_ZOOM_100,
        magnifyX: 0,
        magnifyY: 0,


        pauseWhileAD: false,
        autoScroll: true,
        pauseWhileEditing: !isMobile,
        showCaptionTips: true
    },
    reducers: {
        // Player actions
        setPreference(state, { payload }) {
            return { ...state, ...payload };
        },
        setTransView(state, { payload: { view } }) {
            if (view === null) {
                view = state.prevTransView;
            }
            return { ...state, transView: view, prevTransView: state.view };
        }
    },
    effects: {
        *setTransView({ payload: { view, config = {} } }, { call, put, select, take }) {
            const { sendUserAction = true, updatePrefer = true } = config;
            const { watch } = yield select();
            setTimeout(() => {
                if (watch.caption?.id) {
                    scrollTransToView(watch.currCaption.id, false, watch.media?.isTwoScreen); 
                }
            }, 200);
            if (sendUserAction) {
                uEvent.transviewchange(watch.time, view);
            }
            // UPDATE LOCAL STORAGE
            if (updatePrefer) {
                const { playerpref } = yield select();
                updateLocalStorage(playerpref);
            }
        },
        *setPreference({ payload }, { call, put, select, take }) {
            const { playerpref } = yield select();
            // This is the latest playerpref after reducers get executed
            updateLocalStorage(playerpref);
            // uEvent.pauseWhenADStarts(!pauseWhileAD);
            // uEvent.autoScrollChange(!autoScroll);
            // uEvent.pauseWhenEdit(!pauseWhileEditing);
            // use same api to report NOT IMPLEMENTED
        },
        *toggleOpenAD({ payload }, { call, put, select, take }) {
            const { playerpref } = yield select();
            yield put({ type: 'setPreference', payload: { openAD: !playerpref.openAD } })
        },
        *toggleOpenCC({ payload }, { call, put, select, take }) {
            const { playerpref } = yield select();
            yield put({ type: 'setPreference', payload: { openCC: !playerpref.openCC } })
        },
        *changePlaybackrateByValue({ payload: delta }, { call, put, select, take }) {
            const { playerpref: state } = yield select();
            const target = state.playbackrate - 0 + delta;
            if (target > 4 || target < 0.25) {
                return;
            }
            yield put({ type: 'setPreference', payload: { playbackrate: target } });
        },
        *changeXTranslateByValue({ payload: delta }, { call, put, select, take }) {
            const { playerpref: state } = yield select();
            const target = state.magnifyX + delta;
            yield put({ type: 'setPreference', payload: { magnifyX: target } });
        },
        *changeYTranslateByValue({ payload: delta }, { call, put, select, take }) {
            const { playerpref: state } = yield select();
            const target = state.magnifyY + delta;
            yield put({ type: 'setPreference', payload: { magnifyY: target } });
        },
        *changeCCSizeByValue({ payload: delta }, { call, put, select, take }) {
            const { playerpref: state } = yield select();
            const target = state.cc_size - 0 + delta;
            if (target > 2 || target < 0.75) {
                return;
            }
            yield put({ type: 'setPreference', payload: { cc_size: target } });
        }
    },
    subscriptions: {
        setup({ dispatch }, done) {
            if (storageAvailablity) {
                try {
                    const preference = JSON.parse(localStorage.getItem('CT_preference'));
                    // would execute "save to localStorage" again
                    dispatch({ type: 'setPreference', payload: preference });
                } catch {
                    // CATCH
                }
            }
        },
    },
}
export default PlayerModel;