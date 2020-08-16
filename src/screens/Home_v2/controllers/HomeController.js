import _ from 'lodash';
import { api, prompt, ARRAY_INIT, NOT_FOUND_404, user } from 'utils';
import { homeState } from './HomeState';
import HomeConstants from './HomeConstants';

class HomeController {
  async setupHomepage() {
    const universities = await this.getUniversities();
    homeState.setUniversities(universities);

    const offerings = await this.getOfferings();
    homeState.setOfferings(api.parseOfferings(offerings));

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

    api.contentLoaded();
  }

  async selectUniversity(universityId) {
    if (universityId) {
      const university = _.find(homeState.universities, { id: universityId });
      if (university) {
        homeState.setSelUniversity(universityId);
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

  async buildStarredOfferings() {
    const starredOfferingIds = await this.getStarredOfferings();
    const starredOfferings = starredOfferingIds
      .map(soffid => _.find(homeState.offerings, { id: soffid }))
      .filter(soff => Boolean(soff));
    homeState.setStarredOfferings(starredOfferings);
  }

  buildSections() {
    const {
      universities,
      selUniversity,
      departments,
      selDepartments,
      selTerms,
      offerings,
      starredOfferings,
      watchHistory
    } = homeState;

    let sections = [];
    if (starredOfferings.length > 0) {
      sections.push({
        type: HomeConstants.FSectionCourses,
        id: 'starred-offs-section',
        title: 'Starred Courses',
        icon: 'bookmark',
        items: starredOfferings
      });
    }

    if (watchHistory.length > 0) {
      sections.push({
        type: HomeConstants.FSectionVideos,
        id: 'watch-history-section',
        title: 'Continue Watching',
        icon: 'history',
        items: watchHistory
      });
    }

    // build departments sections
    let currDepartments = departments;
    if (selDepartments.length > 0) {
      currDepartments = departments.map((depart) => selDepartments.includes(depart.id));
    }

    let departSections = currDepartments
      .map((depart) => ({
        type: HomeConstants.FSectionCourses,
        id: depart.id,
        title: depart.name,
        subTitle: depart.university ? depart.university.name : '',
        items: _.filter(offerings, off => {
          return off.departmentIds.includes(depart.id)
                && (selTerms.length === 0 || selTerms.includes(off.termId))
                && (selUniversity === null || selUniversity === off.universityId)
        })
      }))
      .filter((sec) => sec.items.length > 0);
    
    homeState.setSections([...sections, ...departSections]);
  }

  async getUniversities() {
    try {
      const { data } = await api.getUniversities();
      // filter out the default university
      return _.filter(data, uni => uni.id !== HomeConstants.UnknownUniversityID);
    } catch (error) {
      homeState.setError(HomeConstants.CTHomepageLoadError);
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
      prompt.error('Failed to load departments.');
      return [];
    }
  }

  parseDepartments(departments, universityId) {
    let university = null;
    if (universityId) {
      university = _.find(homeState.universities, { id: universityId });
    }

    return _.map(departments, (depart) => {
      let departUni = university || _.find(homeState.universities, { id: depart.universityId });
      return { ...depart, university: departUni };
    });
  }
  
  async getTerms(universityId) {
    try {
      const { data } = await api.getTermsByUniId(universityId);
      return data;
    } catch (error) {
      prompt.error('Failed to load terms.');
      return [];
    }
  }
  
  async getOfferings() {
    try {
      const { data } = await api.getOfferingsByStudent();
      return data;
    } catch (error) {
      prompt.error('Failed to load courses.');
      return NOT_FOUND_404;
    }
  }
  
  async getWatchHistory() {
    try {
      const { data } = await api.getUserWatchHistories();
      return data;
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
}

export const homeCtrl = new HomeController();