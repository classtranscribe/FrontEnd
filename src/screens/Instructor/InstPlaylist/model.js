import { api, user, prompt, InvalidDataError, ARRAY_INIT, links } from 'utils';
import _ from 'lodash';
import pathToRegexp from 'path-to-regexp';
import ErrorTypes from 'entities/ErrorTypes';
/*
function setupMediaDetail() {
    const { mid } = uurl.useHash();
    if (mid) {
        const currMedia = _.find(this.medias, { id: mid });
        if (currMedia) {
            this.setMedia(currMedia);
        }
    }
}
*/
const Util = {
    async getPlaylistById(playlistId) {
        try {
            let { data } = await api.getPlaylistById(playlistId);
            return data;
        } catch (error) {
            return ErrorTypes.getError(error);
        }
    },
    async getOfferingById(offeringId) {
        try {
            let { data } = await api.getOfferingById(offeringId);
            return api.parseSingleOffering(data);
        } catch (error) {
            return ErrorTypes.NotFound404;
        }
    },
    /** * Check if a user is valid */
    isAuthorized(instructorIds) {
        // Admin should be able to access any content
        if (user.isAdmin) {
            return true;
        }

        // check if the user is the course admin for this playlist
        // this user can be a non-instructor, 
        // aka anyone in the course staff email list will have the access
        const instIdx = _.findIndex(instructorIds, { id: user.userId });
        if (instIdx >= 0) {
            return true;
        }

        return false;
    }
}
const initialState = {
    offering: {},
    playlist: {},
    medias: ARRAY_INIT,
    confirmation: null,
}
const InstPlaylistModel = {
    namespace: 'instplaylist',
    state: {
        ...initialState
    },
    reducers: {
        setOffering(state, { payload }) {
            return { ...state, offering: payload };
        },
        setPlaylist(state, { payload }) {
            return { ...state, playlist: payload };
        },
        setMedias(state, { payload }) {
            return { ...state, medias: payload };
        },
        setConfirmation(state, { payload }) {
            return { ...state, confirmation: payload };
        },
        clearData(state, { payload }) {
            return { ...initialState };
        },
    },
    effects: {
        *loadModel({ payload: playlistId }, { call, put, select, take }) {
            yield put.resolve({ type: 'clearData' })

            let offeringLoaded = false;
            const { instplaylist } = yield select();
            /*
            if (instplaylist && instplaylist.offering) {
                this.setOffering(state.offering);
                offeringLoaded = true;
            }
            */

            // sestup playlist

            const playlist = yield call(Util.getPlaylistById, playlistId);
            yield put({ type: 'setPlaylist', payload: playlist });

            if (!playlist.id) {
                api.contentLoaded();
                return;
            }

            const { offeringId, medias } = playlist;

            // setup medias
            yield put({ type: 'setMedias', payload: _.map(medias, api.parseMedia) });

            // setup offering
            if (!offeringId) return;
            let offering = instplaylist.offering;
            if (!offeringLoaded) {
                offering = yield call(Util.getOfferingById, offeringId);
                yield put({ type: 'setOffering', payload: offering })
            }

            if (Util.isAuthorized(offering.instructorIds)) {
                api.contentLoaded();
            } else {
                // back to student version playlist page if not authorized
                // todo: this is so bad!
                window.location = links.course(offering.id, playlist.id);
            }
        },
        *reorderMedias({ payload: { medias, callback } }, { call, put, select, take }) {
            const { instplaylist } = yield select();
            const oldMedias = [...instplaylist.medias];
            yield put({ type: 'setMedias', payload: medias });
            if (typeof callback === 'function') callback(medias);
            try {
                const mediaIds = _.map(medias, ({ id }) => id);
                yield call(api.reorderMedias, instplaylist.playlist.id, mediaIds);
                prompt.addOne({ text: 'Videos reordered.', timeout: 3000 });
            } catch (error) {
                yield put({ type: 'setMedias', payload: oldMedias });
                if (typeof callback === 'function') callback(oldMedias);
                prompt.error('Failed to reorder videos.', { timeout: 5000 });
            }
        },
        *renameMedia({ payload: { mediaId, name } }, { call, put, select, take }) {
            try {
                const { instplaylist } = yield select();
                yield call(api.renameMedia, mediaId, name);
                let medias = instplaylist.medias;
                let currIdx = _.findIndex(medias, { id: mediaId });
                if (currIdx >= 0) {
                    medias[currIdx].mediaName = name;
                    yield put({ type: 'setMedias', payload: [...medias] });
                    prompt.addOne({ text: 'Video renamed.', timeout: 3000 });
                } else {
                    // throw Error('No such video');
                }
            } catch (error) {
                prompt.error('Failed to rename the video.', { timeout: 5000 });
            }
        },
        *deleteMedias({ payload: mediaIds }, { call, put, select, take }) {
            try {
                const { instplaylist } = yield select();
                for(const mediaId of mediaIds) {
                    yield call(api.deleteMedia, mediaId);
                }
                yield put({ type: 'setMedias', payload: _.filter(instplaylist.medias, me => !_.includes(mediaIds, me.id)) });
                prompt.addOne({ text: 'Video deleted.', timeout: 3000 });
            } catch (error) {
                prompt.error('Failed to delete the video.', { timeout: 5000 });
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                const pathname = event.pathname ? event.pathname : event.location?.pathname
                const match = pathToRegexp('/playlist/:id/:option?').exec(pathname);
                if (match) {
                    const playlistId = match[1];
                    dispatch({ type: 'loadModel', payload: playlistId });
                }
            })
        }
    }
};
export default InstPlaylistModel;