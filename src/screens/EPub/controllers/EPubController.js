import ErrorTypes from 'entities/ErrorTypes';
import { api, prompt } from 'utils';
import { epubState } from './EPubStateManager';
import { epubData } from './EPubDataController';

class EPubController {
  async setEPubPage(ePubId) {
    var _epub = await this.getEPubById(ePubId);
    console.log('_epub', _epub);
    // Parse epub data
    _epub = epubData.initEPubData(_epub);
    const chapters = _epub.chapters;
    delete _epub['chapters'];
    epubState.setEPub(_epub);
    epubState.setChapters(chapters);

    api.contentLoaded(100);

    if (ErrorTypes.isError(_epub)) {
      prompt.error('Failed to load ePub data.', 5000);
      return;
    }
  }

  async getEPubById(ePubId) {
    try {
      const { data } = await api.getEPubById(ePubId);
      return data;
    } catch (error) {
      return ErrorTypes.getError(error);
    }
  }
}

export default EPubController;
export const epubCtrl = new EPubController();