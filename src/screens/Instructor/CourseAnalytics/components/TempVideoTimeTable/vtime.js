import _, { set } from 'lodash';
import Papa from 'papaparse';
import { api } from 'utils';

const fileDownload = require('js-file-download');

const A_VERY_OLD_DATE_ISO_STR = '2010-04-03T11:11:11.111Z';

export class VideoTimeLogsHandler {
  constructor() {
    this.logs = [];
  }

  init({ offeringId, setParsedData, setTotal, setPlaylistData, setAllLogs, setEditTransCount }) {
    this.offeringId = offeringId;
    this.setParsedData = setParsedData;
    this.setTotal = setTotal;
    this.setEditTransCount = setEditTransCount;
    this.setPlaylistData = setPlaylistData;
    this.setAllLogs = setAllLogs;
  }

  download() {
    const csvList = this.logs.map((elem) => ({ ...elem, totalVideoTime: elem.count }));
    _.forEach(csvList, (log) => delete log.count);
    const csvStr = Papa.unparse(csvList);
    fileDownload(csvStr, 'video-time.csv');
  }

  downloadEditTransCount(editTransCount) {
    const csvList = editTransCount.map((elem) => ({ email: elem.email, count: elem.count }));
    const csvStr = Papa.unparse(csvList);
    fileDownload(csvStr, 'edit-trans-count.csv');
  }

  async setup() {
    const recentTimeupdates = await this.getRecentTimeUpdateLogs();
    const editTransLogs = await this.getEditTransLogs();
    if (this.setEditTransCount) {
      this.setEditTransCount(_.reverse(_.sortBy(editTransLogs, 'count')));
    }

    const totalTimeupdates = await this.getTotalTimeUpdateLogs();
    const logs = this.combineLogs(totalTimeupdates, recentTimeupdates, editTransLogs);
    const playListLogs = await this.getPlayListsByCourseId();
    let allLogs = await this.getAllCourseLogs();
    allLogs = this.combineAllLogsAndEditTransLogs(allLogs, editTransLogs);
    this.setAllLogs(allLogs);
    this.setPlaylistData(playListLogs);
    this.logs = [...logs];
    this.setTotal(logs);
  }

  parseLogs(data) {
    return _.map(data, (elem) => ({
      email: elem.user ? elem.user.email : 'unknown',
      ..._.reduce(
        elem.medias,
        (total, media) => {
          Object.keys(total).forEach((key) => {
            total[key] += media[key] || 0;
          });
          return total;
        },
        { lastHr: 0, last3days: 0, lastWeek: 0, lastMonth: 0, count: 0, editTransCount: 0 },
      ),
    }));
  }

  parseMedia(media, playListId) {
    let media_array = [];
    for (let i = 0; i < media.length; i+= 1) {
      let el = media[i];
      media_array.push({
        id: el.id,
        playlistId: playListId,
        name: el.name,
      });
    }
    return media_array;
  }
  parsePlaylists(data) {
    let playlists = [];
    for (let i = 0; i < data.length; i+= 1) {
      let playlist = {
        id: data[i].id,
        name: data[i].name,
        media: this.parseMedia(data[i].medias, data[i].id),
      };
      playlists.push(playlist);
    }
    return playlists;
  }
  parseAllLogs(data) {
    let logs = [];
    for (let i = 0; i < data.length; i+= 1) {
      logs.push({
        media: data[i].medias,
        email: data[i].user.email,
        firstName: data[i].user.firstName,
        lastName: data[i].user.lastName,
        id: data[i].id,
        editTransCount: 0,
      });
    }
    return logs;
  }

  async getRecentTimeUpdateLogs() {
    try {
      const { data } = await api.getCourseLogs('timeupdate', this.offeringId);
      return this.parseLogs(data);
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.');
      return [];
    }
  }

  async getEditTransLogs() {
    try {
      const { data } = await api.getCourseLogs(
        'edittrans',
        this.offeringId,
        A_VERY_OLD_DATE_ISO_STR,
        new Date().toISOString(),
      );

      return this.parseLogs(data);
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.');
      return [];
    }
  }

  async getTotalTimeUpdateLogs() {
    try {
      const { data } = await api.getCourseLogs(
        'timeupdate',
        this.offeringId,
        A_VERY_OLD_DATE_ISO_STR,
        new Date().toISOString(),
      );

      return this.parseLogs(data);
    } catch (error) {
      console.error('Failed to get total timeupdate logs.');
      return [];
    }
  }

  async getPlayListsByCourseId() {
    try {
      if (localStorage.getItem("dataLogs") == null) {
          const { data } = await api.getPlayListsByCourseId(this.offeringId);
          localStorage.setItem("dataLogs", JSON.stringify(data));
      }
      return this.parsePlaylists(JSON.parse(localStorage.getItem("dataLogs")));
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.');
      return [];
    }
  }
  async getAllCourseLogs() {
    try {
      const { data } = await api.getAllCourseLogs(
        'edittrans',
        this.offeringId,
        A_VERY_OLD_DATE_ISO_STR,
        new Date().toISOString(),
      );

      return this.parseAllLogs(data);
    } catch (error) {
      console.error('Failed to get recent timeupdate logs.');
      return [];
    }
  }
  combineAllLogsAndEditTransLogs(allLogs = [], editTransLogs = []) {
    const logs = _.cloneDeep(allLogs);
    _.forEach(editTransLogs, (elem) => {
      const timeElem = _.find(logs, { email: elem.email });
      if (timeElem) {
        timeElem.editTransCount = elem.count;
      }
    });
    return logs;
  }

  combineLogs(totalTimeupdates = [], recentTimeupdates = [], editTransLogs = []) {
    const logs = _.cloneDeep(totalTimeupdates);
    _.forEach(logs, (elem) => {
      const recentElem = _.find(recentTimeupdates, { email: elem.email });
      if (recentElem) {
        Object.keys(elem).forEach((key) => {
          if (typeof elem[key] === 'number') {
            elem[key] += recentElem[key];
          }
        });
      }
    });

    _.forEach(editTransLogs, (elem) => {
      const timeElem = _.find(logs, { email: elem.email });
      if (timeElem) {
        timeElem.editTransCount = elem.count;
      } else {
        logs.push({
          email: elem.email,
          lastHr: 0,
          last3days: 0,
          lastWeek: 0,
          lastMonth: 0,
          count: 0,
          editTransCount: elem.count,
        });
      }
    });

    return _.reverse(_.sortBy(logs, 'count'));
  }
}

export const vtime = new VideoTimeLogsHandler();
