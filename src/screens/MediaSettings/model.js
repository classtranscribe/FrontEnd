import pathToRegexp from 'path-to-regexp';
import { isMobile } from 'react-device-detect';
import { api, links, user } from 'utils';

async function getMedia(mediaId) {
    try {
        const { data } = await api.getMediaById(mediaId);
        return api.parseMedia(data);
    } catch (error) {
        return api.parseMedia();
    }
}
async function getPlaylist(playlistId) {
    try {
        const { data } = await api.getPlaylistById(playlistId);
        return data;
    } catch (error) {
        return {};
    }
}
const MediaSettingModel = {
    namespace: 'mediasetting',
    state: {
        media: api.parseMedia(),
        playlist: {},
        error: null
    },
    reducers: {
        setMedia(state, { payload }) {
            return { ...state, media: payload };
        },
        setPlaylist(state, { payload }) {
            return { ...state, playlist: payload };
        },
        setError(state, { payload }) {
            return { ...state, error: payload };
        },
    },
    effects: {
        *loadMediaSettings({ payload: mediaId }, { call, put, select, take }) {
            links.title('Media Settings');

            const media = yield call(getMedia, mediaId);
            if (!media.id) {
                // @TODO prompt
                return;
            }

            yield put({ type: 'setMedia', payload: media })
            api.contentLoaded();

            const { playlistId } = media;
            if (playlistId) {
                const playlist = yield call(getPlaylist, playlistId);
                yield put({ type: 'setPlaylist', payload: playlist })
            }
        }
    },
    subscriptions: {
        setup({ dispatch, history }) {
            history.listen((event) => {
                const pathname = event.pathname ? event.pathname : event.location?.pathname
                const match = pathToRegexp('/media-settings/:id/:option?').exec(pathname);
                if (match) {
                    if (!isMobile) {
                        dispatch({ type: 'loadMediaSettings', payload: match[1] });
                    } else {
                        api.contentLoaded();
                    }
                }
            })
        }
    }
}
export default MediaSettingModel;