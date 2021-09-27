import { ARRAY_INIT } from 'utils/constants';
import ErrorTypes from 'entities/ErrorTypes';
import _ from 'lodash';
import { api, user, prompt, InvalidDataError } from 'utils';
import HomeConstants from './controllers/HomeConstants';
import FeedSectionBuilder from './controllers/FeedSectionBuilder';

const buildSections = (state) => {
    if (state.error) return;
    const {
        // universities,
        selUniversity,
        departments,
        selDepartments,
        selTerms,
        offerings,
        starredOfferings,
        watchHistory
    } = state;
    const secBuilder = new FeedSectionBuilder(selUniversity, selDepartments, selTerms);
    secBuilder.pushStarredOfferingSection(starredOfferings);
    secBuilder.pushWatchHistorySection(watchHistory);
    secBuilder.pushDepartmentSections(departments, offerings);
    state.hasDepartmentSections = secBuilder.hasDepartmentSections;
    state.sections = secBuilder.getData()
    api.contentLoaded(); // BAD DESIGN
    return state;
}
const HomeModel = {
    namespace: 'home',
    state: {
        error: null,
        universities: ARRAY_INIT,
        departments: ARRAY_INIT,
        terms: ARRAY_INIT,
        selUniversity: null,
        selDepartments: [],
        selTerms: [],
        hasDepartmentSections: false,
        starredOfferings: [],
        watchHistory: [],
        offerings: ARRAY_INIT,
        sections: ARRAY_INIT
    },
    reducers: {
        setUniversities(state, { payload }) {
            return { ...state, universities: payload };
        },
        setOfferings(state, { payload }) {
            return { ...state, offerings: payload };
        },
        setWatchHistory(state, { payload }) {
            return { ...state, watchHistory: payload };
        },
        setStarredOfferings(state, { payload }) {
            const starredOfferings = payload
                .map(soffid => _.find(state.offerings, { id: soffid }))
                .filter(soff => Boolean(soff));

            return { ...state, starredOfferings };
        },
        setTerms(state, { payload }) {
            return { ...state, terms: payload };
        },
        setDepartments(state, { payload }) {
            // build sections
            return buildSections({ ...state, departments: payload });
        },
        setSelUniversity(state, { payload }) {
            // reload university state
            return { ...state, selUniversity: payload, selDepartments: [], selTerms: [] };
        },
        setSelDepartments(state, { payload }) {
            return buildSections({ ...state, selDepartments: payload });
        },
        setSelTerms(state, { payload }) {
            return buildSections({ ...state, selTerms: payload })
        },
        pageLoadError(state, { payload }) {
            if (state.error === HomeConstants.CTHomepageLoadError) return state;
            console.error(state.error)
            state.error = HomeConstants.CTHomepageLoadError
            prompt.addOne({
                text: 'Failed to load the page contents.',
                status: 'error',
                position: 'top',
                timeout: -1,
                refresh: true
            });
            return { ...state }
        }
    },
    effects: {
        *selectDepartments({ payload: selDepartments }, { call, put, select }) {
            yield put.resolve({ type: 'setSelDepartments', payload: selDepartments });
        },
        *selectTerms({ payload: selTerms }, { call, put, select }) {
            yield put.resolve({ type: 'setSelTerms', payload: selTerms });
        },
        *getUniversities(__, { call, put, select }) {
            try {
                const { data } = yield call(api.getUniversities);
                // filter out the default university
                if (Array.isArray(data)) {
                    yield put({
                        type: 'setUniversities',
                        payload: _.filter(data,
                            uni => uni.id !== HomeConstants.UnknownUniversityID).reverse()
                    });
                    return;
                }
                throw InvalidDataError;
            } catch (error) {
                yield put({ type: 'pageLoadError' })
                return ErrorTypes.NotFound404;
            }
        },
        *getOfferings(__, { call, put, select }) {
            try {
                const { data } = yield call(api.getOfferingsByStudent);
                if (Array.isArray(data)) {
                    yield put({
                        type: 'setOfferings',
                        payload: api.parseOfferings(data.slice().reverse(), !user.isAdmin)
                    });
                    return;
                }
                throw InvalidDataError;
            } catch (error) {
                yield put({ type: 'pageLoadError' })
                return ErrorTypes.NotFound404;
            }
        },
        *getWatchHistory(__, { call, put, select }) {
            if (!user.isLoggedIn) return [];
            try {
                const { data } = yield call(api.getUserWatchHistories);
                yield put({
                    type: 'setWatchHistory',
                    payload: data.filter(media => Boolean(media.id))
                });
            } catch (error) {
                return [];
            }
        },
        *getTerms({ payload: universityId }, { call, put, select }) {
            try {
                const { data } = yield call(api.getTermsByUniId, universityId);
                if (Array.isArray(data)) {
                    yield put({ type: 'setTerms', payload: data.slice().reverse() })
                    return;
                }
                throw InvalidDataError;
            } catch (error) {
                yield put({ type: 'pageLoadError' })
                return [];
            }
        },
        *getStarredOfferings({ payload }, { call, put, select }) {
            if (!user.isLoggedIn) return [];
            try {
                const { data } = yield call(api.getUserMetaData);
                const { starredOfferings } = data;
                if (starredOfferings) {
                    yield put({ type: 'setStarredOfferings', payload: Object.keys(JSON.parse(starredOfferings)) });
                }
            } catch (error) {
                return [];
            }
        },
        *getDepartmentsData({ payload: universityId }, { call, put, select }) {
            try {
                const { home: homeState } = yield select();
                let result = null;
                if (universityId) {
                    result = yield call(api.getDepartsByUniId, universityId);
                } else {
                    result = yield call(api.getDepartments);
                }
                const { data } = result;
                let university = null;
                if (universityId) {
                    university = _.find(homeState.universities, { id: universityId });
                }
                yield put({
                    type: 'setDepartments',
                    payload: _.map(data, (depart) => {
                        let departUni = university
                            || _.find(homeState.universities, { id: depart.universityId });
                        return { ...depart, university: departUni };
                    })
                });
            } catch (error) {
                yield put({ type: 'pageLoadError' })
                return [];
            }
        },
        *selectUniversity({ payload: universityId }, { call, put, select }) {
            const { home: homeState } = yield select();
            if (universityId) {
                const university = _.find(homeState.universities, { id: universityId });
                if (university) {
                    // reset selected departments and terms when university changes
                    yield put.resolve({ type: 'setSelUniversity', payload: universityId })
                    // get terms and departs for selected university
                    yield put.resolve({ type: 'getTerms', payload: universityId });
                    yield put.resolve({ type: 'getDepartmentsData', payload: universityId });
                    return;
                }
            }
            yield put.resolve({ type: 'getDepartmentsData' });
        },
        *initialize(__, { call, put, select, take }) {
            yield put.resolve({ type: 'getUniversities' });
            yield put.resolve({ type: 'getOfferings' });
            yield put.resolve({ type: 'getWatchHistory' });
            yield put.resolve({ type: 'getStarredOfferings' });
            if (user.isLoggedIn) { // TODO: LOSE CONTROL OF USER
                const userUniId = user.getUserInfo().universityId;
                yield put({ type: 'selectUniversity', payload: userUniId !== HomeConstants.UnknownUniversityID ? userUniId : null });
            } else {
                yield put({ type: 'selectUniversity', payload: null });
            }
        }
    },
    subscriptions: {
        setup({ dispatch }) {
            // api.contentLoaded(); <- THIS WILL BE COMPLETED BY THE LOADING EFFECTS
            document.addEventListener('readystatechange', e => {
                if (document.readyState === "complete") {
                    dispatch({ type: 'initialize' });
                }
            });
        }
    }
};
export default HomeModel;