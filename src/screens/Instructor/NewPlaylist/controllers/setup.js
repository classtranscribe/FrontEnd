import { StateController } from 'utils/state-controller';
import { api, NOT_FOUND_404 } from 'utils';

class SetupCoursePage extends StateController {
  constructor() {
    super();
    this.clear = this.clear.bind(this);
  }

  init(props) {
    let { 
      setOffering, clearCourseData
    } = props;

    this.register({ 
      setOffering, clearCourseData
    });
  }

  offering = null;
  setOffering(offering) {
    this.setState('setOffering', 'offering', offering);
  }

  clear() {
    const { clearCourseData } = this.dispatches;
    if (clearCourseData) clearCourseData();
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

  lastOfferingId = null;
  async setupCourseSettingsPage(offeringId) {
    // determine whether to reset the redux store
    let shouldClear = this.lastOfferingId && this.lastOfferingId !== offeringId;
    if (shouldClear) {
      this.clear();
    }

    this.lastOfferingId = offeringId;
    
    // get the offering
    let offering = await this.getOfferingById(offeringId);
    this.setOffering(offering);

    api.contentLoaded();

    // if (offering === NOT_FOUND_404) return;
  }
}

export const setup = new SetupCoursePage();