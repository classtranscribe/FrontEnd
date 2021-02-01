import { ARRAY_INIT } from 'utils/constants';
import { uurl } from 'utils/use-url';
import { search } from 'utils';
import _ from 'lodash';

const SearchModel = {
    namespace: 'search',
    state: {
        offerings: ARRAY_INIT,
        searchValue: '',
        searchResult: {},
        result: []
    },
    reducers: {
        setOfferings(state, { payload }) {
            return { ...state, offerings: payload };
        },
        setSearchValue(state, { payload }) {
            return { ...state, searchValue: payload };
        },
        setSearchResult(state, { payload }) {
            return { ...state, searchResult: payload };
        },
        setResult(state, { payload }) {
            return { ...state, result: payload };
        },
    },
    effects: {
        *searchValue({ payload }, { call, put, select, take }) {
            const { home } = yield select();
            yield put({type: 'setSearchValue', payload })
            if (!payload) {
                yield put({type: 'setSearchResult', payload: {}})
                return;
            }
            const offerings = home.offerings;
            if (offerings === ARRAY_INIT) return;
            const courseResult = search.getResults(
                offerings.filter(off => !off.isTestCourse),
                payload,
                [
                    'termName',
                    'fullNumber',
                    'courseName',
                    'sectionName',
                ]
            );
            yield put({type: 'setSearchResult', payload: { courseResult }})
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            document.addEventListener('readystatechange', e => {
                if (document.readyState === "complete") {
                    let { q } = uurl.useSearch();
                    if (q) {
                        let value = _.replace(q, /\+/i, ' ');
                        // TODO: Change URL AND PARSE URL WHEN NEEDED
                        dispatch({ type: 'search/setSearchValue', payload: value })
                    }
                }
            });
        }
    }
}
export default SearchModel;