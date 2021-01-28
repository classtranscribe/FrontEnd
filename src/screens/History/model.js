import { ARRAY_INIT } from 'utils/constants';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError } from 'utils';

const HistoryModel = {
    namespace: 'historypage',
    state: {
        watchHistories: ARRAY_INIT,
    },
    reducers: {
        setWatchHistories(state, { payload }) {
            return { ...state, watchHistories: payload };
        }
    },
    effects: {
        *setupWatchHistories({ payload }, { call, put, select, take }) {
            if (!user.isLoggedIn) return;
            try {
                let { data } = yield call(api.getUserWatchHistories)
                yield put({type: 'setWatchHistories', payload: data.filter(media => media && media.id)})
            } catch (error) {
                prompt.addOne({ text: "Couldn't load watch histories.", status: 'error' });
            }
        },
    },
    subscriptions: {
        setup({ dispatch }) {
            document.addEventListener('readystatechange', e => {
                if (document.readyState === "complete") {
                    dispatch({ type: 'setupWatchHistories' });
                }
            });
        }
    }
}
export default HistoryModel