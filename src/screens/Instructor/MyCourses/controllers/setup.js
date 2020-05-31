import _ from 'lodash';
import { StateController } from 'utils/state-controller';
import { api, user, ARRAY_INIT, NOT_FOUND_404, } from 'utils';

class SetupMyCoursesPage extends StateController {
  init(props) {
    const { setTerms, setOfferings } = props;
    this.register({ setTerms, setOfferings });
  }

  terms = [];
  setTerms(terms) {
    this.setState('setTerms', 'terms', terms);
  }

  offerings = ARRAY_INIT;
  setOfferings(offerings) {
    this.setState('setOfferings', 'offerings', offerings);
  }

  sortOfferings(offerings = [], terms = []) {
    let currentOfferings = [];
    let pastOfferings = [];

    if (offerings === ARRAY_INIT || offerings === NOT_FOUND_404) {
      return { currentOfferings, pastOfferings };
    }

    let currTermId = (terms[0] || {}).id;

    _.forEach(offerings, off => {
      if (off.term.id === currTermId) {
        currentOfferings.push(off);
      } else {
        pastOfferings.push(off);
      }
    });
    // console.log({ currentOfferings, pastOfferings })
    return { currentOfferings, pastOfferings };
  }

  async getMyOfferings() {
    try {
      let { data } = await api.getCourseOfferingsByInstructorId(user.userId);
      return data;
    } catch (error) {
      return [];
    }
  }

  async getTerms() {
    try {
      let { data } = await api.getTermsByUniId(user.getUserInfo().universityId);
      return data;
    } catch (error) {
      return [];
    }
  }

  async getDepartments() {
    try {
      let { data } = await api.getDepartsByUniId(user.getUserInfo().universityId);
      return data;
    } catch (error) {
      return [];
    }
  }

  getFullNumber(offs) {
    let fullNumber = '';
    _.forEach(offs, (off, index) => {
      const { courseNumber } = off;
      const { acronym } = off.depart;
      if (index > 0) fullNumber += '/';
      fullNumber += acronym + courseNumber;
    });

    return fullNumber;
  }

  parseCourseOfferings(courseOfferings = [], departs, terms) {
    // console.log('rawOfferings', courseOfferings)
    if (courseOfferings.length === 0) return [];

    const offerArray = _.map(courseOfferings, (co) => {
      const { courseNumber, departmentId } = co.course;
      const depart = _.find(departs, { id: departmentId });
      const offerings = _.map(co.offerings, (off) => {
        const term = _.find(terms, { id: off.termId });
        return {
          ...off,
          termName: term.name,
          term,
          depart,
          courseNumber,
          course: { ...co.course, acronym: depart.acronym, depart },
        };
      });

      return offerings;
    });

    const offerIds = _.groupBy(_.flatten(offerArray), 'id');
    const offerings = _.map(offerIds, (offs) => {
      const off = offs[0];

      const courses = _.map(offs, (o) => o.course);
      off.courses = courses;

      const fullNumber = this.getFullNumber(offs);
      off.fullNumber = fullNumber;

      if (off.course) delete off.course;
      if (off.depart) delete off.depart;
      return off;
    });

    // console.log('offerings', offerings)
    return (offerings || []).slice().reverse();
  }

  async setupMyCoursesPage() {
    let terms = await this.getTerms();
    this.setTerms(terms);

    let departs = await this.getDepartments();

    let offerings = await this.getMyOfferings();

    
    this.setOfferings(this.parseCourseOfferings(offerings, departs, terms));

    api.contentLoaded();
  }
}

export const setup = new SetupMyCoursesPage();