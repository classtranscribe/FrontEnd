import { links } from 'utils';
import HomeConstants from './HomeConstants';

class FeedSectionBuilder {
  constructor(selUniversity, selDepartments, selTerms) {
    this.__sections = [];
    this.__departmentSections = [];
    this.selUniversity = selUniversity;
    this.selDepartments = selDepartments;
    this.selTerms = selTerms;
  }

  get isFilteringUni() {
    return Boolean(this.selUniversity);
  }

  get isFilteringDepart() {
    return this.selDepartments && this.selDepartments.length > 0;
  }

  get isFilteringTerm() {
    return this.selTerms && this.selTerms.length > 0;
  }

  get isFiltering() {
    return this.isFilteringDepart || this.isFilteringTerm;
  }

  get hasDepartmentSections() {
    return this.__departmentSections.length > 0;
  }

  getData() {
    return this.__sections;
  }

  push(section) {
    this.__sections.push(section);
  }

  pushStarredOfferingSection(starredOfferings) {
    if (starredOfferings.length <= 0 || this.isFiltering) return;

    this.push({
      type: HomeConstants.FSectionCourses,
      id: 'starred-offs-section',
      title: 'Starred Courses',
      icon: 'bookmark',
      items: starredOfferings
    });
  }

  pushWatchHistorySection(watchHistory) {
    if (watchHistory.length <= 0 || this.isFiltering) return;

    this.push({
      type: HomeConstants.FSectionVideos,
      id: 'watch-history-section',
      title: 'Continue Watching',
      icon: 'history',
      items: watchHistory,
      link: links.history()
    });
  }

  __getDepartItems(depart, offerings) {
    const {
      selUniversity,
      selDepartments,
      selTerms
    } = this;

    return offerings.filter(off => {
      return (!this.isFilteringDepart || selDepartments.includes(depart.id))
            && off.departmentIds.includes(depart.id)
            && (!this.isFilteringTerm || selTerms.includes(off.termId))
            && (!this.isFilteringUni || selUniversity === off.universityId)
    });
  }

  pushDepartmentSections(departments, offerings) {
    let departSections = departments
      .map((depart) => ({
        type: HomeConstants.FSectionCourses,
        id: depart.id,
        title: depart.name,
        subTitle: depart.university ? depart.university.name : '',
        link: links.search(depart.acronym),
        items: this.__getDepartItems(depart, offerings)
      }))
      .filter((sec) => sec.items.length > 0);
    
    this.__departmentSections = departSections;
    this.__sections = [...this.__sections, ...departSections];
  }
}

export default FeedSectionBuilder;