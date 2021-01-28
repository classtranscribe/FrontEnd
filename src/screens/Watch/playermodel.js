import { isMobile } from 'react-device-detect';
import {
    preferControl,
    // constants
    CC_COLOR_WHITE,
    CC_COLOR_BLACK,
    CC_SIZE_100,
    CC_SIZE_75,
    CC_FONT_SANS_SERIF,
    CC_OPACITY_75,
    CC_POSITION_BOTTOM,
    // MODAL_SHARE
} from './Utils';
import { uEvent } from './Utils/UserEventController';

const PlayerModel = {
    namespace: 'playerpref',
    state: {
        // Video player options
        volume: preferControl.defaultVolume(),
        muted: preferControl.muted(),
        playbackrate: preferControl.defaultPlaybackRate(), // NOT PERMENENT STORAGE

        // CC options
        cc_color: CC_COLOR_WHITE,
        cc_bg: CC_COLOR_BLACK,
        cc_size: isMobile ? CC_SIZE_75 : CC_SIZE_100,
        cc_font: CC_FONT_SANS_SERIF,
        cc_position: CC_POSITION_BOTTOM,
        cc_opacity: CC_OPACITY_75,

        transView: preferControl.defaultTransView(),

        openCC: preferControl.cc() || true,
        openAD: preferControl.ad() || false,
    },
    reducers: {
        // Player actions
        setVolume(state, { payload }) {
            return { ...state, volume: payload };
        },
        setMute(state, { payload }) {
            return { ...state, muted: payload };
        },
        setTransView(state, { payload: { view } }) {
            if (view === null) {
                view = state.prevTransView;
            }
            return { ...state, transView: view, prevTransView: state.view };
        },
        setPlaybackrate(state, { payload }) {
            return { ...state, playbackrate: payload };
        },
        changePlaybackrateByValue(state, { payload: delta }) {
            const target = state.playbackrate + delta;
            if(target > 4 || target < 0.25 ) {
                return state;
            }
            return {...state, playbackrate : target}
        },

        toggleOpenCC(state, { payload }) {
            return { ...state, openCC: !state.openCC };
        },
        toggleOpenAD(state, { payload }) {
            return { ...state, openAD: !state.openAD };
        },

        // CC Options
        cc_setColor(state, { payload }) {
            return { ...state, cc_color: payload };
        },
        cc_setBG(state, { payload }) {
            return { ...state, cc_bg: payload };
        },
        cc_setOpacity(state, { payload }) {
            return { ...state, cc_opacity: payload };
        },
        cc_setSize(state, { payload }) {
            return { ...state, cc_size: payload };
        },
        cc_setPosition(state, { payload }) {
            return { ...state, cc_font: payload };
        },
        cc_setFont(state, { payload }) {
            return { ...state, cc_position: payload };
        },
    },
    effects: {
        *setTransView({ payload: { view, config = {} } }, { call, put, select, take }) {
            const { sendUserAction = true, updatePrefer = true } = config;
            const { watch } = yield select();
            setTimeout(() => {
                if (watch.caption?.id) {
                    // this.scrollTransToView(this.currCaption_.id, false); NOT IMPLEMENTED
                }
            }, 200);
            // if (updatePrefer) preferControl.defaultTransView(view); NOT IMPLEMENTED
            if (sendUserAction) {
                uEvent.transviewchange(watch.time, view);
            }
        }
    }
}
export default PlayerModel;