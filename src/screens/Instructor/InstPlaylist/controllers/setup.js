import _ from 'lodash';
import { api, uurl, ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { StateController } from 'utils/state-controller';

class InstPlaylistSetup extends StateController {
  init(props) {
    const {
      setOffering, setPlaylist, setMedias,
      setMedia, clearData
    } = props;

    this.register({
      setOffering, setPlaylist, setMedias,
      setMedia, clearData
    });
  }

  offering = {};
  setOffering(offering) {
    this.setState('setOffering', 'offering', offering);
  }

  playlist = {};
  setPlaylist(playlist) {
    this.setState('setPlaylist', 'playlist', playlist);
  }

  medias = ARRAY_INIT;
  setMedias(medias) {
    this.setState('setMedias', 'medias', medias);
  }

  media = null;
  setMedia(media) {
    this.setState('setMedia', 'media', media);
  }

  async getPlaylistById(playlistId) {
    try {
      let { data } = await api.getPlaylistById(playlistId);
      return data;
    } catch (error) {
      return NOT_FOUND_404;
    }
  }

  async getOfferingById(offeringId) {
    try {
      let { data } = await api.getOfferingById(offeringId);
      return api.parseSingleOffering(data);
    } catch (error) {
      return NOT_FOUND_404;
    }
  }

  playlistId = null;
  clearData() {
    const { clearData } = this.dispatches;
    clearData();
    this.playlistId = null;
  }

  setupMediaDetail() {
    const { mid } = uurl.useHash();
    if (mid) {
      const currMedia = _.find(this.medias, { id: mid });
      if (currMedia) {
        this.setMedia(currMedia);
      }
    }
  }

  async setupInstPlaylistPage(playlistId) {
    // if (this.playlistId !== playlistId) {
    //   this.clearData();
    // }

    // sestup playlist
    const playlist = await this.getPlaylistById(playlistId);
    this.setPlaylist(playlist);

    if (!playlist.id) return;
    const { offeringId, medias } = playlist;
    this.playlistId = playlist.id; 

    // sestup medias
    this.setMedias(_.map(medias, api.parseMedia));

    // setup offering
    if (!playlist.offeringId) return;
    const offering = await this.getOfferingById(offeringId);
    this.setOffering(offering);

    api.contentLoaded();
  }
}

export const setup = new InstPlaylistSetup();