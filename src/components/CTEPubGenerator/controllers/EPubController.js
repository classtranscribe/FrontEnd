import _ from 'lodash';
import { prompt, uurl, timestr, ARRAY_INIT } from 'utils';
import Constants from './EPubConstants';
import { epubState } from './EPubState';
import { epubData } from './EPubDataController';
import { getAllItemsInChapters } from './utils';

class EPubController {
  constructor() {
    this.epubId = null;
  }

  isLoading(rawEPubData, chapters) {
    return rawEPubData === ARRAY_INIT || chapters === ARRAY_INIT;
  }

  /// ///////////////////////////////////////////////////////////////
  // Steps
  /// ///////////////////////////////////////////////////////////////

  get isStep0() {
    return epubState.step === Constants.EPubStepLaunchScreen;
  }

  get isStep1() {
    return epubState.step === Constants.EPubStepSplitChapters;
  }

  get isStep2() {
    return epubState.step === Constants.EPubStepEditChapters;
  }

  get isStep3() {
    return epubState.step === Constants.EPubStepDownload;
  }

  createHash(step) {
    return uurl.createHash({ step, eid: this.epubId });
  }

  toStep(step) {
    uurl.setHash(this.createHash(step));
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

  openPlayerModal = (title, begin, end) => {
    epubState.setPlayerData({
      title,
      begin: timestr.toSeconds(begin),
      end: timestr.toSeconds(end)
    });
  }

  closePlayerModal = () => {
    epubState.setPlayerData(null);
  }


  /// ///////////////////////////////////////////////////////////////
  // Setup scripts
  /// ///////////////////////////////////////////////////////////////
  setupEPubGenerator(epubDataLike) {
    // // skip if the epub id is not changed
    // if (this.epubId === epubDataLike.id) return;

    this.epubId = epubDataLike.id;
    const data = epubData.initEPubData(epubDataLike);

    const rawEPubData = getAllItemsInChapters(data.chapters);
    epubState.setRawEPubData(rawEPubData);
    epubState.setChapters(data.chapters);
  }
}

export default EPubController;