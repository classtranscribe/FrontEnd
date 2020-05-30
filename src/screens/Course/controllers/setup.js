import { StateController } from 'utils/state-controller';
import { api, NOT_FOUND_404, ARRAY_INIT } from 'utils';

class SetupCoursePage extends StateController {
  init(props) {
    let { setOffering, setPlaylists, setPlaylist } = props;
    this.register({ setOffering, setPlaylists, setPlaylist });
  }

  offering = null
  setOffering(offering) {
    this.setState('setOffering', 'offering', offering);
  }

  playlists = ARRAY_INIT
  setPlaylists(playlists) {
    this.setState('setPlaylists', 'playlists', playlists);
  }

  playlist = null
  setPlaylist(playlist) {
    this.setState('setPlaylist', 'playlist', playlist);
  }

  async getOfferingById(offeringId) {
    try {
      let { data } = await api.getOfferingById(offeringId);
      return api.parseSingleOffering(data);
    } catch (error) {
      // TODO 404
      return NOT_FOUND_404;
    }
  }

  async getPlaylistsByOfferingId(offeringId) {
    try {
      let { data } = await api.getPlaylistsByOfferingId(offeringId);
      return data;
    } catch (error) {
      return [];
    }
  }

  async setupCoursePage(offeringId) {
    let offering = await this.getOfferingById(offeringId);
    this.setOffering(offering);

    api.contentLoaded();

    if (offering === NOT_FOUND_404) return;

    let playlists = await this.getPlaylistsByOfferingId(offeringId);
    this.setPlaylists(playlists);
  }
}

export const setup = new SetupCoursePage();