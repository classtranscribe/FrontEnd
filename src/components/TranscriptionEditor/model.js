import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError } from 'utils';

const TransEditorModel = {
    namespace: 'transeditor', 
    state: {
        scalelevel: 1,
        scaleLen: [1, 1, 1, 1, 1],
        TLWidth: 1145,
        TLHeight: 138
    },
    reducers: {
        initTimeline(state, { payload: { duration } }) {
            // 一秒是多少像素?
            return { ...state, scaleLen: [duration, duration * 0.75, duration * 0.5, 60, 1] }
        },
        setScaleLevel(state, { payload }) {
            return { ...state, scalelevel: payload };
        },
    },
    effects: {
        *setupWatchHistories({ payload }, { call, put, select, take }) {

        },
    },
    subscriptions: {
        setup({ dispatch }) {

        }
    }
}
export default TransEditorModel