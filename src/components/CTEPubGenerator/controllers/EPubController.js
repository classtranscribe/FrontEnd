import _ from 'lodash';
import { api, prompt, uurl, ARRAY_INIT } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';
import EPubData from './EPubData';
import { parseRawEPubData } from './utils';
// import { buildSubChapter as bsch } from './utils';

class EPubController {
  constructor() {
    this.mediaId = null;
    this.currEPubIndex = null;
  }

  isLoading(chapters) {
    return chapters === ARRAY_INIT;
  }

  /// ///////////////////////////////////////////////////////////////
  // Steps
  /// ///////////////////////////////////////////////////////////////

  get isStep1() {
    return epubState.step === Constants.EPubStepSplitChapters;
  }

  get isStep2() {
    return epubState.step === Constants.EPubStepEditChapters;
  }

  get isStep3() {
    return epubState.step === Constants.EPubStepDownload;
  }

  toStep(step) {
    uurl.setHash(step);
  }

  backToStep1 = () => {
    this.toStep(Constants.EPubStepSplitChapters);
    prompt.addOne({
      text: 'Splitting chapters might lost the changes you made.',
      position: 'left bottom',
      timeout: 4000,
    }, true);
  };

  proceedToStep2 = () => {
    this.toStep(Constants.EPubStepEditChapters);
    prompt.addOne({
      text: "Start editing your chapters' contents.",
      status: 'success',
      position: 'left bottom',
      timeout: 3000,
    }, true);
  };

  proceedToStep3 = () => {
    this.toStep(Constants.EPubStepDownload);
    prompt.addOne({
      text: 'Finish step! Download your ePub file.',
      status: 'success',
      position: 'left bottom',
      timeout: 4000,
    }, true);
  };

  /// ///////////////////////////////////////////////////////////////
  // States
  /// ///////////////////////////////////////////////////////////////

  foldChapter(id) {
    epubState.setFoldedIds([...epubState.foldedIds, id]);
  }

  unfoldChapter(id) {
    let foldedIds = epubState.foldedIds;
    epubState.setFoldedIds(_.filter(foldedIds, (fid) => fid !== id));
  }

  magnifyImage(image) {
    epubState.setMagnifiedImg(image);
  }

  endMagnifyImage() {
    epubState.setMagnifiedImg(null);
  }

  openEPubItemCarousel(ePubItemId) {
    epubState.setEPubItemId(ePubItemId);
  }

  closeEPubItemCarousel = () => {
    if (epubState.ePubItemId) {
      epubState.setEPubItemId(null);
    }
  }


  /// ///////////////////////////////////////////////////////////////
  // Networks
  /// ///////////////////////////////////////////////////////////////

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
      return parseRawEPubData(data);
    } catch (error) {
      // default as 404 error
      console.error(error, `Failed to get ePub data of media for ${mediaId}, ${language}`);
      epubState.setError(Constants.NoEPubDataRequestedError);
    }

    return null;
  }

  async changeLanguage(language) {
    const rawEPubData = await this.getRawEPubData(this.mediaId, language);

    if (!rawEPubData) return;
    epubState.setRawEPubData(rawEPubData);
    epubState.setEPubs([ ...epubState.epubs, new EPubData(rawEPubData) ]);
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