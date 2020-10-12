import { StateController } from 'utils/state-controller';
import ErrorTypes from 'entities/ErrorTypes';
import { api } from 'utils';

export class SetupCoursePage extends StateController {
  constructor(title) {
    super();
    this.clear = this.clear.bind(this);
    this.title = title;
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
      return ErrorTypes.NotFound404;
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

    // if (offering === ErrorTypes.NotFound404) return;
  }
}

export const setup = new SetupCoursePage('Settings');