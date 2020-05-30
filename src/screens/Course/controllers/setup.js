import { StateController } from 'utils/state-controller';
import { api, NOT_FOUND_404, ARRAY_INIT } from 'utils';

class SetupCoursePage extends StateController {
  constructor() {
    super();
    this.clear = this.clear.bind(this);
  }
  init(props) {
    let { 
      setOffering, 
      setPlaylists, setPlaylist, 
      clearCourseData 
    } = props;
    this.register({ 
      setOffering, 
      setPlaylists, setPlaylist,
      clearCourseData
    });
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

  clear() {
    const { clearCourseData } = this.dispatches;
    if (clearCourseData) clearCourseData();
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

  lastOfferingId = null
  async setupCoursePage(offeringId) {
    if (this.lastOfferingId !== offeringId) {
      this.clear();
    }

    this.lastOfferingId = offeringId;
    
    let offering = await this.getOfferingById(offeringId);
    this.setOffering(offering);

    api.contentLoaded();

    if (offering === NOT_FOUND_404) return;

    let playlists = await this.getPlaylistsByOfferingId(offeringId);
    this.setPlaylists(playlists);
  }

  async getPlaylistById(playlistId) {
    if (!playlistId) return null;
    try {
      let { data } = await api.getPlaylistById(playlistId);
      return data;
    } catch (error) {
      return NOT_FOUND_404;
    }
  }

  async setupPlaylist(playlistId) {
    let playlist = await this.getPlaylistById(playlistId);
    this.setPlaylist(playlist);
  }
}

export const setup = new SetupCoursePage();