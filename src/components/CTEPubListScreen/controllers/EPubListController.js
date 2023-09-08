import SourceTypes from 'entities/SourceTypes';
import ErrorTypes from 'entities/ErrorTypes';
import { api, prompt, uurl, links } from 'utils';
import { EPubData } from 'entities/EPubs/structs';
import Constants from 'screens/EPub/controllers/constants/EPubConstants';
import { LanguageConstants } from '../../CTPlayer';
import { _parseRawEPubData } from './helpers';

class EPubListController {
  async setupEPubsData(sourceType, sourceId, source) {
    if (!source) {
      source = await this.getSource(sourceType, sourceId);
    }

    const languages = this.getLanguages(sourceType, source);
    const ePubs = await this.getEPubs(sourceType, sourceId);
    const rawEPubData = this.getRawEPubData(sourceType, sourceId, LanguageConstants.English);

    return { source, ePubs, languages, rawEPubData };
  }

  async createEPub(sourceType, sourceId, data) {
    prompt.addOne({ text: 'Creating I-Note...', timeout: 4000 });
    const rawEPubData = await this.getRawEPubData(sourceType, sourceId, data.language);
    if (rawEPubData === ErrorTypes.NotFound404) {
      prompt.error('Failed to create the I-Note.');
      return false;
    }

    // Process ePub data
    const ePubData = EPubData.create(rawEPubData, {
      sourceType, sourceId, ...data
    }).toObject();

    delete ePubData.id;
    // console.log(ePubData);

    // POST the data
    const newEPubData = await this.postEPubData(ePubData);
    if (!newEPubData) {
      prompt.error('Failed to create the I-Note.');
      return null;
    }

    uurl.openNewTab(
      links.epub(newEPubData.id, Constants.EditINote, Constants.HFromNew)
    );

    return newEPubData;
  }

  async postEPubData(ePubData) {
    try {
      const resp = await api.createEPub(ePubData);
      return resp.data;
      // console.log(resp);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getRawEPubData(sourceType, sourceId, language) {
    let rawEPubData = null;
    if (sourceType === SourceTypes.Media) {
      rawEPubData = await this.getMediaRawEPubData(sourceId, language);
    }

    return rawEPubData;
  }

  async getMediaRawEPubData(mediaId, language) {
    try {
      let { data } = await api.getEpubData(mediaId, language);
      return _parseRawEPubData(data);
    } catch (error) {
      console.error(error, `Failed to get I-Note data of media for ${mediaId}, ${language}`);
      return ErrorTypes.NotFound404;
    }
  }

  getLanguages(sourceType, source) {
    if (sourceType === SourceTypes.Media) {
      if (!source || !source.transcriptions) {
        return [];
      }
      return source.transcriptions.map(trans => trans.language);
    }
  }

  async getSource(sourceType, sourceId) {
    let source = null
    if (sourceType === SourceTypes.Media) {
      source = await this.getMedia(sourceId);
    }

    return source;
  }

  async getMedia(mediaId) {
    try {
      const { data } = await api.getMediaById(mediaId);
      return api.parseMedia(data);
    } catch (error) {
      return ErrorTypes.NotFound404;
    }
  }

  async getEPubs(sourceType, sourceId) {
    try {
      const { data } = await api.getEPubsBySource(sourceType, sourceId);
      return data.slice().reverse();
    } catch (error) {
      return ErrorTypes.NotFound404;
    }
  }

  async requestEPub(sourceType, sourceId) {
    if (sourceType === SourceTypes.Media) {
      await this.requestMediaEPub(sourceId)
    }

    prompt.addOne({
      text: 'Request sent.',
      status: 'success',
      timeout: 3000
    });
  }

  async requestMediaEPub(mediaId) {
    try {
      await api.requestEPubCreation(mediaId);
    } catch (error) {
      console.error(`Failed to request a I-Note for ${mediaId}`);
    }
  }

  // Controller to delete an I•Note
  async deleteEPub(epubId) {
    try {
      await api.deleteEPub(epubId);
    } catch (error) {
      console.error(`Failed to delete a I-Note for ${epubId}`);
    }
  }

  // Controller to rename an I•Note
  async renameEpub(epubId, title) {
    let resp;
    try {
      resp = await api.getEPubById(epubId);
      resp.data.title = title;
      resp.data.filename = title;
    } catch {
      console.error(`Unable to fetch data for ${epubId}`);
    }

    try {
      await api.updateEPubSimple(epubId, resp.data);
    } catch {
      console.error(`Failed to rename a epub for ${epubId}`)
    }
  }
}

export default EPubListController;
export const EPubListCtrl = new EPubListController();