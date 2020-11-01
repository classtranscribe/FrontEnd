import _ from 'lodash';
import SourceTypes from 'entities/SourceTypes';
import ErrorTypes from 'entities/ErrorTypes';
import { EPubData } from 'entities/EPubs';
import { LanguageConstants } from 'components/CTPlayer';
import { api, prompt, links, timestr, uurl, elem, ARRAY_INIT } from 'utils';
import { EPubListCtrl } from 'components/CTEPubListScreen/controllers/EPubListController';
import Constants from './constants/EPubConstants';
import { epubState } from './EPubStateManager';
import { epubData } from './EPubDataController';

class EPubController {
  constructor() {
    this.ePubId = null;
    this.languages = [];
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

    this.handleHashValues();

    api.contentLoaded(100);

    if (ErrorTypes.isError(_epub)) {
      prompt.error('Failed to load ePub data.', 5000);
      return;
    }

    links.title(_epub.title);

    if (_epub.sourceType === SourceTypes.Media) {
      const media = await this.getMediaById(_epub.sourceId);
      this.languages = EPubListCtrl.getLanguages(_epub.sourceType, media);
      epubState.setMedia(media);
    }
  }

  async duplicateEPub(newData, copyChapterStructure) {
    prompt.addOne({ text: 'Copying ePub data...', timeout: 4000 });
    const oldData = epubState.epub;
    const newLanguage = newData.language;
    const isDifferentLanguage = newLanguage !== epubState.epub.language;
    if (!newData.chapters) {
      newData.chapters = epubState.chapters;
    }

    if (isDifferentLanguage) {
      const rawEPubData = await EPubListCtrl.getRawEPubData(
        oldData.sourceType, oldData.sourceId, newLanguage
      );

      newData = EPubData.create(rawEPubData, newData, copyChapterStructure).toObject();
    }

    delete newData.id;

    const newEPubData = await EPubListCtrl.postEPubData(newData);
    if (!newEPubData) {
      prompt.error('Failed to create the ePub.');
      return;
    }

    uurl.openNewTab(links.epub(newEPubData.id, Constants.EpbEditStructure));
  }

  handleHashValues() {
    const { view, h } = uurl.useHash();
    if (Constants.EPubViews.includes(view)) {
      epubState.setView(view);
    }

    if (h) {
      elem.scrollIntoView(h);
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