import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError } from 'utils';

const TransEditorModel = {
    namespace: 'transeditor',
    state: {
        scalelevel: 1
    },
    reducers: {
        setScaleLevel(state, { payload }) {
            return { ...state, scalelevel: payload };
        }
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