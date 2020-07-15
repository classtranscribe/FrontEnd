// import _ from 'lodash';
import { api, prompt, ARRAY_INIT } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';
import EPubData from './EPubData';
// import { buildSubChapter as bsch } from './utils';

class EPubController {
  constructor() {
    this.mediaId = null;
    this.currEPubIndex = null;
  }

  isLoading(rawEPubData) {
    return rawEPubData === ARRAY_INIT;
  }

  async requestEPub(mediaId) {
    try {
      await api.requestEPubCreation(mediaId);
      prompt.addOne({
        text: 'Request sent.',
        status: 'success',
        timeout: 3000
      });
    } catch (error) {
      console.error(`Failed to request a epub for ${mediaId}`);
    }
  }

  async getRawEPubData(mediaId, language) {
    epubState.setError('');
    try {
      let { data } = await api.getEpubData(mediaId, language);
      return data;
    } catch (error) {
      // default as 404 error
      console.error(error, `Failed to get ePub data of media for ${mediaId}, ${language}`);
      epubState.setError(Constants.ERR_NO_EPUB);
    }

    return null;
  }

  async setupEPubGenWithMediaId(mediaId, language) {
    // skip if the media id is not changed
    if (this.mediaId === mediaId) return;

    this.mediaId = mediaId;
    // display the loader while getting the epub data
    if (epubState.rawEPubData !== ARRAY_INIT) {
      epubState.setRawEPubData(ARRAY_INIT);
    }

    const rawEPubData = await this.getRawEPubData(mediaId, language);

    if (!rawEPubData) return;
    epubState.setRawEPubData(rawEPubData);

    // temporarily create a fake epubs array
    // in the future this should be obtained from server
    epubState.setEPubs([ new EPubData(rawEPubData) ]);
  }

  changeEPub(currEPubIndex, chapters) {
    if (this.currEPubIndex === currEPubIndex) return;
    this.currEPubIndex = currEPubIndex;

    epubState.setCurrEPubIndex(currEPubIndex);
    epubState.setChapters(chapters);
  }
}

export default EPubController;