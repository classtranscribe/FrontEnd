import _ from 'lodash';
import { api, prompt, uurl, ARRAY_INIT } from 'utils';
import { CTPlayerConstants as PConstants } from '../../CTPlayer';
import Constants from './EPubConstants';
import EPubData from './EPubData';
import { epubState } from './EPubState';
import { parseRawEPubData } from './utils';

/**
 * The controller for handling events for the ePubs books
 */
class EPubListController {
  constructor() {
    this.media = {};
    this.currEPub = null;
  }

  isLoading(error, epubs) {
    return !error && epubs === ARRAY_INIT;
  }

  canStartGenerator(currEPub, step) {
    return currEPub instanceof EPubData 
        && step !== Constants.EPubStepLaunchScreen;
  }

  proceedToEPubGenerator(currEPub) {
    // console.log('proceedToEPubGenerator')
    uurl.setHash(
      uurl.createHash({ step: Constants.EPubStepSplitChapters, eid: currEPub.id })
    );
  }

  determineStep(hash) {
    // console.log('determineStep')
    let { step } = uurl.useHash(hash);
    if (Constants.EPubSteps.includes(step)) {
      epubState.setStep(step);
    } else {
      epubState.setStep(Constants.EPubStepDefaultFirstStep);
    }
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
    try {
      let { data } = await api.getEpubData(mediaId, language);
      return parseRawEPubData(data);
    } catch (error) {
      // default as 404 error
      console.error(error, `Failed to get ePub data of media for ${mediaId}, ${language}`);
      epubState.setError(Constants.EPubDataNotRequestedError);
    }

    return null;
  }

  async getEPubs(mediaId) {
    // fake epubs with an empty array
    return [];
  }

  async setupLaunchScreen(media) {
    if (this.media.id === media.id) return;
    this.media = media;
    // console.log('setupLaunchScreen')

    // clear location's hash if any
    const { step } = uurl.useHash();
    if (step) {
      window.location.replace(window.location.pathname);
    }

    epubState.setError(null);
    if (epubState.epubs !== ARRAY_INIT) {
      epubState.setEPubs(ARRAY_INIT);
    }

    // check if the raw epub data exists
    // if not raise the error and ternimate the setup
    const rawEPubData = await this.getRawEPubData(media.id, PConstants.ENGLISH);
    if (!rawEPubData) return;

    // if the epub exists, get the epubs
    const epubs = await this.getEPubs(media.id);
    epubState.setEPubs(epubs);
  }

  async createEPub(language) {
    prompt.addOne({ text: 'Initializing the ePub data ...', timeout: -1 });

    // get epub data for the chosen language
    const rawEPubData = await this.getRawEPubData(this.media.id, language);
    if (!rawEPubData) return;
    epubState.setRawEPubData(rawEPubData);

    // create a proto epub from the raw epub data
    const newEPub = EPubData.create(rawEPubData, language, this.media.mediaName);
    epubState.setEPubs([ ...epubState.epubs, newEPub ]);
    epubState.setCurrEPub(newEPub);
    this.proceedToEPubGenerator(newEPub);

    prompt.closeAll();
  }

  changeEPub(epubDataLike) {
    // if (this.currEPub && epubDataLike.id === this.currEPub.id) return;
    // console.log('changeEPub')

    this.currEPub = epubDataLike;
    epubState.setCurrEPub(epubDataLike);
    this.proceedToEPubGenerator(epubDataLike);
  }
}

export default EPubListController;