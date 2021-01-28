import { api, user, prompt, InvalidDataError, ARRAY_INIT } from 'utils';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';

async function getMyOfferings() {
    try {
        let { data } = await api.getCourseOfferingsByInstructorId(user.userId);
        return data;
    } catch (error) {
        return api.errorType(error);
    }
}
function getFullNumber(offs) {
    let fullNumber = '';
    _.forEach(offs, (off, index) => {
        const { courseNumber } = off;
        const { acronym } = off.depart;
        if (index > 0) fullNumber += '/';
        fullNumber += acronym + courseNumber;
    });

    return fullNumber;
}
async function getTerms() {
    try {
        const { data } = await api.getTermsByUniId(user.getUserInfo().universityId);
        if (Array.isArray(data)) {
            return data.slice().reverse();
        }
        throw InvalidDataError;
    } catch (error) {
        prompt.error('Failed to load terms.');
        return [];
    }
}

async function getDepartments() {
    try {
        let { data } = await api.getDepartsByUniId(user.getUserInfo().universityId);
        return data;
    } catch (error) {
        return [];
    }
}
function parseCourseOfferings(courseOfferings = [], departs, terms) {
    // console.log('rawOfferings', courseOfferings)
    if (courseOfferings.length === 0) return [];

    let offerArray = _.map(courseOfferings, (co) => {
        const { courseNumber, departmentId } = co.course;
        const depart = _.find(departs, { id: departmentId });
        const offerings = _.map(co.offerings, (off) => {
            const term = _.find(terms, { id: off.termId });

            if (!term || !depart) {
                console.error('Detect invalid offering', off.id);
                return null;
            }

            return {
                ...off,
                termName: term.name,
                term,
                depart,
                courseNumber,
                course: { ...co.course, acronym: depart.acronym, depart },
            };
        });

        return offerings;
    });

    offerArray = _.filter(_.flatten(offerArray), off => off !== null);

    const offerIds = _.groupBy(offerArray, 'id');
    const offerings = _.map(offerIds, (offs) => {
        const off = offs[0];

        const courses = _.map(offs, (o) => o.course);
        off.courses = courses;

        const fullNumber = getFullNumber(offs);
        off.fullNumber = fullNumber;

        if (off.course) delete off.course;
        if (off.depart) delete off.depart;
        return off;
    });

    // console.log('offerings', offerings)
    return (offerings || []).slice().reverse();
}

const InstCourseModel = {
    namespace: 'instcourse',
    state: {
        terms: [],
        offerings: ARRAY_INIT,
    },
    reducers: {
        setTerms(state, { payload }) {
            return { ...state, terms: payload };
        },
        setMyOfferings(state, { payload }) {
            return { ...state, offerings: payload };
        },
    },
    effects: {
        *loadModel({ payload }, { call, put, select, take }) {
            let terms = yield call(getTerms);
            yield put({type: 'setTerms', payload: terms});

            let departs = yield call(getDepartments);
            let offerings = yield call(getMyOfferings);

            api.contentLoaded();
            if (api.isError(offerings)) {
                yield put({ type: 'setMyOfferings', payload: offerings })
                return;
            }
            yield put({ type: 'setMyOfferings', payload: parseCourseOfferings(offerings, departs, terms) })
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                const pathname = event.pathname ? event.pathname : event.location?.pathname
                const match = pathToRegexp('/instructor/my-courses/:option?').exec(pathname);
                if (match) {
                    dispatch({ type: 'loadModel', payload: null });
                }
            })
        }
    }
};
export default InstCourseModel;