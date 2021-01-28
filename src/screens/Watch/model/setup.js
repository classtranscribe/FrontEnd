import _ from 'lodash';
import { isSafari, isIPad13, isIPhone13 } from 'react-device-detect';
import { api, links, uurl } from 'utils';


export default {
    media_: api.parseMedia(),
    playlist_: {},
    playlists_: {},
    externalFunctions: {},
    init(props, dispatch) {
        this.dispatch = dispatch;
    },

    /**
     * Functions for setting data
     * ************************************************************************
     */

    /**
     * Helper functions
     * ************************************************************************
     */

    findNeighbors(mediaId, playlist) {
        const { medias } = playlist || {};
        if (!medias) return {};
        // medias = (medias || []).slice().reverse()
        const currIdx = _.findIndex(medias, { id: mediaId });
        const nextIdx = currIdx + 1;
        const prevIdx = currIdx - 1;
        const next = medias[nextIdx] || null;
        const prev = medias[prevIdx] || null;
        return { next, prev };
    },

    /**
     * Funcitons for setup watch page
     * ************************************************************************
     */


    async getPlaylist(playlistId) {
        // let { state } = this.externalFunctions.location
        // if (state && state.playlist) return state.playlist
        try {
            const { data } = await api.getPlaylistById(playlistId);
            // _.reverse(data.medias || [])
            return data;
        } catch (error) {
            return null;
        }
    },

    async getPlaylists(offeringId) {
        // // if the playlists exist
        // if (this.playlists().length > 0) return null

        // let { state } = this.externalFunctions.location
        // if (state && state.playlists) return state.playlists

        try {
            const { data } = await api.getPlaylistsByOfferingId(offeringId);
            return data;
        } catch (error) {
            return [];
        }
    },

    async getMediaWatchHistories(mediaId) {
        try {
            const { data } = await api.getMediaWatchHistories(mediaId);
            console.error('getMediaWatchHistories', data);
            return data;
        } catch (error) {
            console.error('Failed to get watch histories.');
            return {};
        }
    },
};
