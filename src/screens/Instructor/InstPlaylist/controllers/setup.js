import _ from 'lodash';
import ErrorTypes from 'entities/ErrorTypes';
import { api, user, uurl, links, ARRAY_INIT } from 'utils';
import { StateController } from 'utils/state-controller';

class InstPlaylistSetup extends StateController {
  constructor() {
    super();
    this.closeConfirmation = this.closeConfirmation.bind(this);
  }
  
  init(props) {
    const {
      setOffering, setPlaylist, setMedias,
      setConfirmation, clearData
    } = props;

    this.register({
      setOffering, setPlaylist, setMedias,
      setConfirmation, clearData
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

  confirmation = null;
  setConfirmation(confirmation) {
    this.setState('setConfirmation', 'confirmation', confirmation);
  }

  confirm({
    title,
    text,
    onConfirm
  }) {
    this.setConfirmation({
      title,
      text,
      onConfirm
    });
  }

  closeConfirmation() {
    this.setConfirmation(null);
  }

  async getPlaylistById(playlistId) {
    try {
      let { data } = await api.getPlaylistById(playlistId);
      return data;
    } catch (error) {
      return ErrorTypes.getError(error);
    }
  }

  async getOfferingById(offeringId) {
    try {
      let { data } = await api.getOfferingById(offeringId);
      return api.parseSingleOffering(data);
    } catch (error) {
      return ErrorTypes.NotFound404;
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

// Assigns playlist to this.playlist, similiar for offering.
// since the offering data is got via playlist.offeringId, so playlist.offeringId === this.offering.id
// this.playlistId is from the URL when the page is loaded.
  async setupInstPlaylistPage(playlistId, state) {
    if (this.playlistId !== playlistId) {
      this.clearData();
    }

    let offeringLoaded = false;
    if (state && state.offering) {
      this.setOffering(state.offering);
      offeringLoaded = true;
    }

    // sestup playlist
  
    const playlist = await this.getPlaylistById(playlistId);
    this.setPlaylist(playlist);

    if (!playlist.id) {
      api.contentLoaded();
      return;
    }

    const { offeringId, medias } = playlist;
    this.playlistId = playlist.id; 

    // sestup medias
    this.setMedias(_.map(medias, api.parseMedia));

    // setup offering
    if (!playlist.offeringId) return;
    if (!offeringLoaded) {
      const offering = await this.getOfferingById(offeringId);
      this.setOffering(offering);
    }

    // check if the user is the course admin for this playlist
    const instIdx = _.findIndex(this.offering.instructorIds, { id: user.userId });
    if (instIdx < 0) {
      // back to student version playlist page if not authorized
      window.location = links.offeringDetail(this.offering.id, playlist.id);
    } else {
      api.contentLoaded();
    }
  }
}

export const setup = new InstPlaylistSetup();
