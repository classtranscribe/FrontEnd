import _ from 'lodash';
import SourceTypes from 'entities/SourceTypes';
import ErrorTypes from 'entities/ErrorTypes';
import { api, prompt, links, timestr, ARRAY_INIT } from 'utils';
import { epubState } from './EPubStateManager';
import { epubData } from './EPubDataController';

class EPubController {
  constructor() {
    this.ePubId = null;
  }

  async loadEPubPageData(ePubId) {
    if (this.ePubId === ePubId) {
      epubState.resetStates();
      return;
    }

    this.ePubId = ePubId;
    var _epub = await this.getEPubById(ePubId);
    // console.log('-----epub', _epub);
    // Parse epub data
    _epub = epubData.initEPubData(_epub);
    const chapters = _epub.chapters;
    delete _epub['chapters'];
    epubState.setEPub(_epub);
    epubState.setChapters(chapters);

    api.contentLoaded(100);
    links.title(_epub.title);

    if (ErrorTypes.isError(_epub)) {
      prompt.error('Failed to load ePub data.', 5000);
      return;
    }

    if (_epub.sourceType === SourceTypes.Media) {
      const media = await this.getMediaById(_epub.sourceId);
      epubState.setMedia(media);
    }
  }

  isLoading(epub, chapters) {
    return chapters === ARRAY_INIT || epub === null;
  }

  async getEPubById(ePubId) {
    try {
      const { data } = await api.getEPubById(ePubId);
      return data;
    } catch (error) {
      return ErrorTypes.getError(error);
    }
  }

  async getMediaById(mediaId) {
    try {
      const { data } = await api.getMediaById(mediaId);
      return api.parseMedia(data);
    } catch (error) {
      return ErrorTypes.getError(error);
    }
  }
  
  foldChapter(id) {
    epubState.setFoldedIds([...epubState.foldedIds, id]);
  }

  unfoldChapter(id) {
    let foldedIds = epubState.foldedIds;
    epubState.setFoldedIds(_.filter(foldedIds, (fid) => fid !== id));
  }

  openPlayer(title, begin, end) {
    if (!epubState.media) return;
    epubState.setPlayerData({
      title,
      begin: timestr.toSeconds(begin),
      end: timestr.toSeconds(end)
    });
  }

  closePlayer() {
    if (!epubState.media) return;
    epubState.setPlayerData(null);
  }
}

export default EPubController;
export const epubCtrl = new EPubController();