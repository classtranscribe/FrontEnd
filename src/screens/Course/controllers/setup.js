import { StateController } from 'utils/state-controller';
import { api, NOT_FOUND_404, ARRAY_INIT, prompt } from 'utils';

class SetupCoursePage extends StateController {
  constructor() {
    super();
    this.clear = this.clear.bind(this);
    this.star = this.star.bind(this);
    this.unstar = this.unstar.bind(this);
  }
  init(props) {
    let { 
      setOffering, setStarredOfferings,
      setPlaylists, setPlaylist,
      clearCourseData,
    } = props;
    this.register({ 
      setOffering, setStarredOfferings,
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

  starredOfferings = {}
  setStarredOfferings(starredOfferings) {
    this.setState('setStarredOfferings', 'starredOfferings', starredOfferings)
  }

  clear() {
    const { clearCourseData } = this.dispatches;
    if (clearCourseData) clearCourseData();
  }

  async star() {
    this.starredOfferings[this.offering.id] = 'starred';
    try {
      await api.postUserMetaData({ 
        starredOfferings: JSON.stringify(this.starredOfferings) 
      });

      this.setStarredOfferings({ ...this.starredOfferings });
    } catch (error) {
      delete this.starredOfferings[this.offering.id];
      prompt.addOne({ text: 'Faild to star the course', status: 'error' });
    }
  }

  async unstar() {
    if (this.starredOfferings[this.offering.id]) {
      delete this.starredOfferings[this.offering.id];
    }

    try {
      await api.postUserMetaData({ 
        starredOfferings: JSON.stringify(this.starredOfferings) 
      });

      this.setStarredOfferings({ ...this.starredOfferings });
    } catch (error) {
      this.starredOfferings[this.offering.id] = 'starred';
      prompt.addOne({ text: 'Faild to unstar the course', status: 'error' });
    }
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
      return NOT_FOUND_404;
    }
  }

  async getStarredOfferings() {
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

    let starredOfferings = await this.getStarredOfferings();
    this.setStarredOfferings(starredOfferings);
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