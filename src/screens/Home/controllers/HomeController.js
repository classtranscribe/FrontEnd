import _ from 'lodash';
import { 
  api,
  user,
  links,
  prompt,
  InvalidDataError,
  NOT_FOUND_404
} from 'utils';
import { homeState } from './HomeState';
import HomeConstants from './HomeConstants';
import FeedSectionBuilder from './FeedSectionBuilder';

class HomeController {
  constructor() {
    this.selectUniversity = this.selectUniversity.bind(this);
  }

  async setupHomepage() {
    api.contentLoaded();
    
    const universities = await this.getUniversities();
    homeState.setUniversities(universities);

    const offerings = await this.getOfferings();
    homeState.setOfferings(offerings);

    const watchHistory = await this.getWatchHistory();
    homeState.setWatchHistory(watchHistory);

    await this.buildStarredOfferings();

    if (user.isLoggedIn) {
      const userUniId = user.getUserInfo().universityId;
      if (userUniId !== HomeConstants.UnknownUniversityID) {
        await this.selectUniversity(userUniId);
      } else {
        await this.selectUniversity(null);
      }
    } else {
      await this.selectUniversity(null);
    }
  }

  async selectUniversity(universityId) {
    if (universityId) {
      const university = _.find(homeState.universities, { id: universityId });
      if (university) {
        // reset selected departments and terms when university changes
        homeState.setSelDepartments([]);
        homeState.setSelTerms([]);
        homeState.setSelUniversity(universityId);
        // get terms and departs for selected university
        const terms = await this.getTerms(universityId);
        const departments = await this.getDepartments(universityId);
        homeState.setTerms(terms);
        homeState.setDepartments(departments);

        this.buildSections();
        return;
      }
    }

    const departments = await this.getDepartments();
    homeState.setDepartments(departments);

    this.buildSections();
  }

  async selectDepartments(selDepartments) {
    homeState.setSelDepartments(selDepartments);
    this.buildSections();
  }

  async selectTerms(selTerms) {
    homeState.setSelTerms(selTerms);
    this.buildSections();
  }

  async buildStarredOfferings() {
    const starredOfferingIds = await this.getStarredOfferings();
    const starredOfferings = starredOfferingIds
      .map(soffid => _.find(homeState.offerings, { id: soffid }))
      .filter(soff => Boolean(soff));
    homeState.setStarredOfferings(starredOfferings);
  }

  buildSections() {
    if (homeState.error) return;
    const {
      // universities,
      selUniversity,
      departments,
      selDepartments,
      selTerms,
      offerings,
      starredOfferings,
      watchHistory
    } = homeState;

    const secBuilder = new FeedSectionBuilder(selUniversity, selDepartments, selTerms);
    secBuilder.pushStarredOfferingSection(starredOfferings);
    secBuilder.pushWatchHistorySection(watchHistory);
    secBuilder.pushDepartmentSections(departments, offerings);
    
    homeState.setSections(secBuilder.getData());
  }

  async getUniversities() {
    try {
      const { data } = await api.getUniversities();
      // filter out the default university
      if (Array.isArray(data)) {
        return _.filter(data, uni => uni.id !== HomeConstants.UnknownUniversityID)
                .reverse();
      } 
        throw InvalidDataError;
    } catch (error) {
      this.pageLoadError();
      return NOT_FOUND_404;
    }
  }
  
  async getDepartments(universityId) {
    try {
      if (universityId) {
        const { data } = await api.getDepartsByUniId(universityId);
        return this.parseDepartments(data, universityId);
      } 

      const { data } = await api.getDepartments();
      return this.parseDepartments(data);
    } catch (error) {
      this.pageLoadError();
      return [];
    }
  }

  parseDepartments(departments, universityId) {
    let university = null;
    if (universityId) {
      university = _.find(homeState.universities, { id: universityId });
    }

    return _.map(departments, (depart) => {
      let departUni = university 
                    || _.find(homeState.universities, { id: depart.universityId });
      return { ...depart, university: departUni };
    });
  }
  
  async getTerms(universityId) {
    try {
      const { data } = await api.getTermsByUniId(universityId);
      if (Array.isArray(data)) {
        return data.slice().reverse();
      } 
        throw InvalidDataError;
    } catch (error) {
      this.pageLoadError();
      return [];
    }
  }
  
  async getOfferings() {
    try {
      const { data } = await api.getOfferingsByStudent();
      if (Array.isArray(data)) {
        return api.parseOfferings(data.slice().reverse(), !user.isAdmin);
      } 
        throw InvalidDataError;
    } catch (error) {
      this.pageLoadError();
      return NOT_FOUND_404;
    }
  }
  
  async getWatchHistory() {
    try {
      const { data } = await api.getUserWatchHistories();
      return data.filter(media => Boolean(media.id));
    } catch (error) {
      return [];
    }
  }
  
  async getStarredOfferings() {
    try {
      const { data } = await api.getUserMetaData();
      const { starredOfferings } = data;
      if (starredOfferings) {
        return Object.keys(JSON.parse(starredOfferings));
      }

      return [];
    } catch (error) {
      return [];
    }
  }

  pageLoadError() {
    if (homeState.error === HomeConstants.CTHomepageLoadError) return;

    homeState.setError(HomeConstants.CTHomepageLoadError);
    prompt.addOne({
      text: 'Failed to load the page contents.',
      status: 'error',
      position: 'top',
      timeout: -1,
      refresh: true
    });
  }
}

export const homeCtrl = new HomeController();