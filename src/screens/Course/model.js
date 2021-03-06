import { ARRAY_INIT, STUDENT, INSTRUCTOR, api, user, prompt } from 'utils';
import ErrorTypes from 'entities/ErrorTypes';
import PublishStatus from 'entities/PublishStatus';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import UserEventManager from 'entities/UserEvent';

const initState = {
    offering: null,
    playlists: ARRAY_INIT,
    playlist: null,
    starredOfferings: {},
    role: STUDENT,
    isInstMode: false,
}
const getStarredOfferings = async () => {
    try {
        let { data } = await api.getUserMetaData();
        let { starredOfferings } = data;
        if (starredOfferings) {
            return JSON.parse(starredOfferings);
        }
        return {};
    } catch (error) {
        return {};
    }
}
const CourseModel = {
    namespace: 'course',
    state: { ...initState },
    reducers: {
        setOffering(state, { payload }) {
            return { ...state, offering: payload };
        },
        setPlaylists(state, { payload }) {
            return { ...state, playlists: payload };
        },
        setPlaylist(state, { payload }) {
            return { ...state, playlist: payload };
        },
        setStarredOfferings(state, { payload }) {
            return { ...state, starredOfferings: payload };
        },
        setRole(state, { payload }) {
            return { ...state, role: payload };
        },
        setIsInstMode(state, { payload }) {
            return { ...state, isInstMode: payload };
        },

        clearCourseData(state, { payload }) {
            return { ...initState }
        },
    },
    effects: {
        *loadCourse({ payload }, { call, put, select, take }) {
            const { course } = yield select();
            const offeringId = payload;
            // determine whether to reset the redux store
            if (course.offering?.id !== offeringId) {
                yield put({ type: 'clearCourseData' });
            }

            // get the offering
            let offering = ErrorTypes.NotFound404;
            try {
                let { data } = yield call(api.getOfferingById, offeringId);
                offering = api.parseSingleOffering(data);
            } catch {
                // 
            }
            yield put.resolve({ type: 'setOffering', payload: offering });
            api.contentLoaded();
            if (offering === ErrorTypes.NotFound404) {
                return;
            }

            // determine role of the user for this offering
            let instIndex = _.findIndex(
                offering.instructorIds,
                { email: user.getUserInfo().emailId }
            );

            if (instIndex >= 0 || user.isAdmin) {
                yield put({ type: 'setRole', payload: INSTRUCTOR });
                yield put({ type: 'setIsInstMode', payload: true })
            }
            try {
                let gpll = yield call(api.getPlaylistsByOfferingId, offeringId);
                let playlists = gpll.data;
                yield put({ type: 'setPlaylists', payload: playlists })
                // get starred offerings
                let starredOfferings = yield call(getStarredOfferings);
                yield put({ type: 'setStarredOfferings', payload: starredOfferings })
            } catch {
                yield put({ type: 'setPlaylists', payload: ErrorTypes.NotFound404 })
            }
        },
        *setStar({ payload: { offeringId, isStar } }, { call, put, select, take }) {
            const { course } = yield select();
            const starredOfferings = course.starredOfferings;
            if (isStar) {
                starredOfferings[offeringId] = 'starred';
            } else {
                delete starredOfferings[offeringId];
            }
            try {
                yield call(api.postUserMetaData, {
                    starredOfferings: JSON.stringify(starredOfferings)
                });
                yield put({ type: 'setStarredOfferings', payload: { ...starredOfferings } })
            } catch (error) {
                delete this.starredOfferings[this.offering.id];
                prompt.error('Faild to star the course.');
            }
        },
        *setPublishStatus({ payload: { publishStatus } }, { call, put, select, take }) {
            const { course } = yield select();
            const offering = course.offering;
            const updatedOff = {
                id: offering.id, 
                sectionName: offering.sectionName, 
                courseName: offering.courseName, 
                description: offering.description, 
                termId: offering.termId, 
                accessType: offering.accessType, 
                logEventsFlag: offering.logEventsFlag, 
                publishStatus
            };
            try {
                yield call(api.updateOffering, updatedOff);
                yield put({ type: 'setOffering', payload: {...offering, publishStatus}});
                const isPublished = publishStatus === PublishStatus.Published;
                prompt.addOne({
                    text: `Course ${ isPublished ? 'published.' : 'unpublished.'}`,
                    timeout: 5000
                });
            } catch (error) {
                console.error(error);
                prompt.error('Failed to update the publish status.');
            }
        },
        *updatePlaylists({ payload }, { call, put, select, take }) {
            const { course } = yield select();
            const oldPlaylists = [...course.playlists];
            yield put({ type: 'setPlaylists', payload })
            try {
                const playlistIds = _.map(payload, ({ id }) => id);
                yield call(api.reorderPlaylists, course.offering.id, playlistIds);
                // handle things after return
                prompt.addOne({ text: 'Playlists reordered.', timeout: 3000 });
            } catch (error) {
                yield put({ type: 'setPlaylists', oldPlaylists })
                prompt.addOne({ text: 'Failed to reorder playlists.', timeout: 5000 });
            }
        },
        *getPlaylistById({ payload: playlistId }, { call, put, select, take }) {
            try {
                let { data } = yield call(api.getPlaylistById, playlistId);
                yield put({ type: 'setPlaylist', payload: data })
            } catch (error) {
                yield put({ type: 'setPlaylist', payload: ErrorTypes.NotFound404 })
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                const pathname = event.pathname ? event.pathname : event.location?.pathname
                const match = pathToRegexp('/offering/:id/:option?').exec(pathname);
                if (match) {
                    const offeringId = match[1];
                    const uevent = new UserEventManager();
                    uevent.selectcourse(offeringId);
                    dispatch({ type: 'loadCourse', payload: offeringId });
                }
            })
        }
    }
}
export default CourseModel