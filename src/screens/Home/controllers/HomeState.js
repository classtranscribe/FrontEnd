import { ARRAY_INIT } from 'utils/constants';
import { StateController } from 'utils/state-controller';

class HomeState extends StateController {
  init(props) {
    let {
      setError,
      setUniversities,
      setTerms,
      setDepartments,
      setSelUniversity,
      setSelDepartments,
      setSelTerms,
      setStarredOfferings,
      setWatchHistory,
      setOfferings,
      setSections
    } = props;

    this.register({
      setError,
      setUniversities,
      setTerms,
      setDepartments,
      setSelUniversity,
      setSelDepartments,
      setSelTerms,
      setStarredOfferings,
      setWatchHistory,
      setOfferings,
      setSections
    });
  }

  error = null
  setError(error) {
    this.setState('setError', 'error', error);
  }

  universities = ARRAY_INIT
  setUniversities(universities) {
    this.setState('setUniversities', 'universities', universities);
  }

  terms = ARRAY_INIT
  setTerms(terms) {
    this.setState('setTerms', 'terms', terms);
  }
  
  departments = ARRAY_INIT
  setDepartments(departments) {
    this.setState('setDepartments', 'departments', departments);
  }

  selUniversity = null
  setSelUniversity(selUniversity) {
    this.setState('setSelUniversity', 'selUniversity', selUniversity);
  }
  
  selDepartments = []
  setSelDepartments(selDepartments) {
    this.setState('setSelDepartments', 'selDepartments', selDepartments);
  }
  
  selTerms = []
  setSelTerms(selTerms) {
    this.setState('setSelTerms', 'selTerms', selTerms);
  }
  
  starredOfferings = ARRAY_INIT
  setStarredOfferings(starredOfferings) {
    this.setState('setStarredOfferings', 'starredOfferings', starredOfferings);
  }

  watchHistory = ARRAY_INIT
  setWatchHistory(watchHistory) {
    this.setState('setWatchHistory', 'watchHistory', watchHistory);
  }

  offerings = ARRAY_INIT
  setOfferings(offerings) {
    this.setState('setOfferings', 'offerings', offerings);
  }

  sections = ARRAY_INIT
  setSections(sections) {
    this.setState('setSections', 'sections', sections);
  }
}

export const homeState = new HomeState();