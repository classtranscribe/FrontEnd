import _ from 'lodash';
import { isSafari, isIPad13, isIPhone13 } from 'react-device-detect';
import { api, links, uurl, userAction } from 'utils';
import { transControl } from './trans.control';
import { videoControl } from './player.control';
import { menuControl } from './menu.control';
import { promptControl } from './prompt.control';
import { ERR_INVALID_MEDIA_ID, ERR_AUTH } from './constants.util';

export const setup = {
  media_: api.parseMedia(),
  playlist_: {},
  playlists_: {},
  externalFunctions: {},
  init(props, setError) {
    const {
      setMedia,
      setPlaylist,
      setPlaylists,
      setOffering,
      setWatchHistory,
      setStarredOfferings,
      location,
      history,
      changeVideo,
    } = props;

    this.externalFunctions = {
      setMedia,
      setPlaylist,
      setPlaylists,
      setOffering,
      setWatchHistory,
      setStarredOfferings,
      location,
      history,
      changeVideo,
      setError,
    };
  },

  /**
   * Functions for setting data
   * ************************************************************************
   */

  media(media_) {
    if (media_ === undefined) return this.media_;

    const { setMedia } = this.externalFunctions;
    if (setMedia) {
      setMedia(media_);
      this.media_ = media_;
    }
  },

  playlist(playlist_) {
    if (playlist_ === undefined) return this.playlist_;

    const { setPlaylist } = this.externalFunctions;
    if (setPlaylist) {
      setPlaylist(playlist_);
      this.playlist_ = playlist_;
    }
  },

  playlists(playlists_) {
    if (playlists_ === undefined) return this.playlists_;

    const { setPlaylists } = this.externalFunctions;
    if (setPlaylists) {
      setPlaylists(playlists_);
      this.playlists_ = playlists_;
    }
  },

  offering(offering_) {
    if (offering_ === undefined) return this.offering_;

    const { setOffering } = this.externalFunctions;
    if (setOffering) {
      setOffering(offering_);
      this.offering_ = offering_;
    }
  },

  /**
   * Helper functions
   * ************************************************************************
   */
  clear(media) {
    const { changeVideo } = this.externalFunctions;
    if (changeVideo) changeVideo({});
    userAction.changevideo(videoControl.currTime(), media.id);
    videoControl.clear();
    transControl.clear();
    menuControl.clear();
  },

  async changeVideo(media) {
    await videoControl.sendMediaHistories();
    const { history } = this.externalFunctions;
    // if (!playlist) {
    //   playlist = this.playlist()
    // }
    history.push(links.watch(media.id));
  },

  findNeighbors(mediaId, playlist) {
    let mid = mediaId;
    if (!mid) {
      mid = this.media().id;
    }

    let playlist_ = playlist;
    if (!playlist_) {
      playlist_ = this.playlist();
    }
    const { medias } = playlist_;
    if (!medias) return {};
    // medias = (medias || []).slice().reverse()
    const currIdx = _.findIndex(medias, { id: mid });
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
  async getMedia() {
    const { setError } = this.externalFunctions;
    const { id } = uurl.useSearch();

    try {
      const { data } = await api.getMediaById(id);
      return api.parseMedia(data);
    } catch (error) {
      if (api.parseError(error).status === 404) {
        setError(ERR_INVALID_MEDIA_ID);
      } else {
        setError(ERR_AUTH);
      }
      return null;
    }
  },

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

  async getOffering(offeringId) {
    // let { state } = this.externalFunctions.location
    // if (state && state.offering) return state.offering

    try {
      const { data } = await api.getOfferingById(offeringId);
      return data;
    } catch (error) {
      return {};
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

  /**
   * Function for getting media, playlist, and playlists
   */
  async setupMedias() {
    // Get media
    const media = await this.getMedia();
    if (!media) {
      api.contentLoaded();
      return;
    }

    // reset data
    this.clear(media);

    // Set transcriptions
    const { transcriptions } = media;
    transControl.transcriptions(transcriptions);

    // Get Playlist
    const { playlistId } = media;
    const playlist = await this.getPlaylist(playlistId);

    if (!playlist) {
      promptControl.error('playlist');
      api.contentLoaded();
      return;
    }

    // // set user metadata
    // let watchHistory = await this.getMediaWatchHistories(media.id)
    // if (watchHistory.json && watchHistory.json.timestamp) {
    //   media.begin = watchHistory.json.timestamp
    // }

    // Set data
    this.media(media);
    this.playlist(playlist);

    const { offeringId } = playlist;

    // Get offering
    let offering = await this.getOffering(offeringId);
    offering = api.parseSingleOffering(offering);
    this.offering(offering);

    api.contentLoaded();

    // Get playlists
    const playlists = await this.getPlaylists(offeringId);
    if (playlists) this.playlists(playlists);

    // Initialize user action handler
    const mediaId = media.id;
    userAction.init({ offeringId, mediaId });

    if (isSafari && isIPad13 && isIPhone13) {
      promptControl.videoNotLoading();
    }
  },
};
