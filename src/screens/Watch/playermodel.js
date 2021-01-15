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
import { isMobile } from 'react-device-detect';
const PlayerModel = {
    namespace: 'playerpref',
    state: {
        // Video player options
        volume: preferControl.defaultVolume(),
        muted: preferControl.muted(),

        // CC options
        cc_color: CC_COLOR_WHITE,
        cc_bg: CC_COLOR_BLACK,
        cc_size: isMobile ? CC_SIZE_75 : CC_SIZE_100,
        cc_font: CC_FONT_SANS_SERIF,
        cc_position: CC_POSITION_BOTTOM,
        cc_opacity: CC_OPACITY_75,
    },
    reducers: {
        // Player actions
        setVolume(state, { payload }) {
            return { ...state, volume: payload };
        },
        setMute(state, { payload }) {
            return { ...state, muted: payload };
        },
        setFullscreen(state, { payload }) {
            return { ...state, isFullscreen: payload };
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
    }
}
export default PlayerModel;