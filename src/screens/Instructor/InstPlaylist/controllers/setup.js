import { api, ARRAY_INIT, NOT_FOUND_404 } from 'utils';
import { StateController } from 'utils/state-controller';

class InstPlaylistSetup extends StateController {
  init(props) {
    const {
      setOffering, setPlaylist, setMedias
    } = props;

    this.register({
      setOffering, setPlaylist, setMedias
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

  async setupInstPlaylistPage(playlistId) {
    const playlist = await this.getPlaylistById(playlistId);
    this.setPlaylist(playlist);

    if (!playlist.id) return;
    const { offeringId, medias } = playlist; 
    this.setMedias(medias);

    if (!playlist.offeringId) return;
    const offering = await this.getOfferingById(offeringId);
    this.setOffering(offering);

    api.contentLoaded();
  }
}

export const setup = new InstPlaylistSetup();