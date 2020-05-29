import _ from 'lodash';
import { api, uurl, links, user } from 'utils';
import {
  NEW_OFFERING,
  NO_OFFERING,
  LOADING_S_OFF,
  LOADING_INIT,
  ARRAY_INIT,
  ARRAY_EMPTY,
  // NO_PLAYLIST,
  NEW_PLAYLIST,
} from './constants';
import { promptControl } from './prompt.control';

export const setup = {
  externalFunctions: {},
  offerings_: [],
  terms_: [],
  departments_: [],
  offering_: {},

  /**
   * @param {Function}
   * setDeparts, setTerms,
   * setOfferings, setOffering,
   * setPlaylists, setPlaylist,
   */
  init(props) {
    const {
      setDeparts,
      setTerms,
      setOfferings,
      setOffering,
      setPlaylists,
      setPlaylist,
      setOrdering,
      setLoading,
      setConfirmation,
      history,
    } = props;

    this.externalFunctions = {
      setDeparts,
      setTerms,
      setOfferings,
      setOffering,
      setPlaylists,
      setPlaylist,
      setOrdering,
      setLoading,
      setConfirmation,
      history,
    };
  },

  loading(opt = LOADING_S_OFF) {
    const { setLoading } = this.externalFunctions;
    if (setLoading) setLoading(opt);
  },

  unloading() {
    this.loading(LOADING_INIT);
  },

  /**
   *
   * @param {Object} confirmation { title, text, onConfirm }
   */
  confirm(confirmation) {
    const { setConfirmation } = this.externalFunctions;
    if (setConfirmation) setConfirmation(confirmation);
  },

  orderList(ordering) {
    const { setOrdering } = this.externalFunctions;
    if (setOrdering) setOrdering(ordering);
  },

  offerings(offerings_) {
    if (offerings_ === undefined) {
      if (
        this.offerings_ === NO_OFFERING ||
        this.offerings_ === ARRAY_EMPTY ||
        this.offerings_ === ARRAY_INIT
      ) {
        return [];
      }
      return this.offerings_;
    }

    const { setOfferings } = this.externalFunctions;
    if (setOfferings) {
      this.offerings_ = offerings_;
      setOfferings(offerings_);
    }
  },
  terms(terms_) {
    if (terms_ === undefined) return this.terms_;
    const { setTerms } = this.externalFunctions;
    if (setTerms) {
      this.terms_ = terms_;
      setTerms(terms_);
    }
  },
  departments(departments_) {
    if (departments_ === undefined) return this.departments_;
    const { setDeparts } = this.externalFunctions;
    if (setDeparts) {
      this.departments_ = departments_;
      setDeparts(departments_);
    }
  },
  offering(offering_) {
    if (offering_ === undefined) return this.offering_;
    const { setOffering } = this.externalFunctions;
    if (setOffering) {
      this.offering_ = offering_;
      setOffering(offering_);
      // Update the document title w/ offering number
      links.title(offering_.courseNumber);
    }
  },
  /**
   * Setup Playlists
   * ********************************************************************************************
   */

  changeOffering(offering, updateSearch = true) {
    const { history } = this.externalFunctions;
    if (offering.id === this.offering().id) return;

    this.playlists_ = [];
    if (offering === NEW_OFFERING) {
      this.offering({});
      // setTimeout(() => setOffering(offering), 100);
    } else {
      this.offering(offering);
    }

    // console.log('o', offering)

    if (updateSearch) {
      const offId = offering.id;
      history.replace(`/instructor/${offId}`);
    }

    // history.replace(`${window.location.pathname}${query}`)
  },

  newOffering() {
    // const { history } = this.externalFunctions
    this.offering(NEW_OFFERING);
  },

  /**
   * Setup Offerings
   * ********************************************************************************************
   */

  checkAuthentication() {
    if (!user.isLoggedIn) {
      user.signIn();
    } else if (!user.isInstructor) {
      window.location = links.notfound404();
    }
    return true;
  },

  async getDepartsByUniversityId() {
    const { data } = await api.getDepartsByUniId(user.getUserInfo().universityId);
    return data;
  },

  async getTermsByUniversityId() {
    const { data } = await api.getTermsByUniId(user.getUserInfo().universityId);
    return (data || []).slice().reverse();
  },

  getFullNumber(offs) {
    let fullNumber = '';
    _.forEach(offs, (off, index) => {
      const { courseNumber } = off;
      const { acronym } = off.depart;
      if (index > 0) fullNumber += '/';
      fullNumber += acronym + courseNumber;
    });

    return fullNumber;
  },

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
      off.courseNumber = fullNumber;

      if (off.course) delete off.course;
      if (off.depart) delete off.depart;
      return off;
    });

    // console.log('offerings', offerings)
    return (offerings || []).slice().reverse();
  },

  async getLinkedUsersByOfferingId(offeringId, callBack) {
    const users = { instructors: [], students: [] };
    try {
      const instsResp = await api.getInstructorsByOfferingId(offeringId);
      const stuResp = await api.getStudentsByOfferingId(offeringId);
      users.instructors = instsResp.data;
      users.students = stuResp.data;
    } catch (error) {
      return users;
    }

    if (callBack) callBack(users);
    return users;
  },

  async getCourseOfferingsByInstructorId() {
    this.errors = [];
    try {
      const { data } = await api.getCourseOfferingsByInstructorId(user.userId);
      const departments = await this.getDepartsByUniversityId();
      const terms = await this.getTermsByUniversityId();
      const offerings = this.parseCourseOfferings(data, departments, terms);

      // console.log('offerings', offerings)
      // console.log('departments', departments)
      // console.log('terms', terms)

      this.terms(terms);
      this.departments(departments);
      this.offerings(offerings);

      api.contentLoaded();
    } catch (error) {
      promptControl.error(['load offerings', 'departments', 'and terms']);
    }
  },

  async setupOfferings(context) {
    if (this.offerings().length > 0) return;

    if (this.checkAuthentication()) {
      await this.getCourseOfferingsByInstructorId(context);
    }
  },

  /**
   * Setup Playlists
   * ********************************************************************************************
   */
  playlists_: [],
  playlist_: {},
  playlists(playlists_) {
    if (playlists_ === undefined) {
      if (this.playlists_ === ARRAY_EMPTY) return [];
      return this.playlists_;
    }
    const { setPlaylists } = this.externalFunctions;
    if (setPlaylists) {
      this.playlists_ = playlists_;
      setPlaylists(playlists_);
    }
  },

  playlist(playlist_) {
    if (playlist_ === undefined) return this.playlist_;
    const { setPlaylist } = this.externalFunctions;
    if (setPlaylist) {
      this.playlist_ = playlist_;
      setPlaylist(playlist_);
    }
  },

  async setUpPlaylists(offeringId) {
    try {
      this.playlists_ = ARRAY_INIT;
      let { data } = await api.getPlaylistsByOfferingId(offeringId);
      // if switched offering while loading data

      // TEMPORARY: for sorting
      data = _.map(data, (pl, index) => ({ ...pl, index }));

      if (data.length > 0 && data[0].offeringId !== setup.offering().id) return;

      // otherwise, set playlists
      // _.forEach(data, pl => _.reverse(pl.medias))

      if (data.length === 0) data = ARRAY_EMPTY;
      this.playlists(data);
    } catch (error) {
      // Blank
      console.error('Failed to load playlists.');
      promptControl.error(['load playlists.']);
    }
  },

  setupPlaylist(setResults) {
    const playlists = this.playlists();

    if (playlists !== ARRAY_INIT) {
      if (playlists === ARRAY_EMPTY) {
        // If there is no playlist
        this.changePlaylist(NEW_PLAYLIST);
        setResults([]);
      } else {
        const { plid } = uurl.useSearch();
        if (plid) {
          // if the plid is specified in the url
          const requestPl = _.find(playlists, { id: plid });
          if (requestPl) {
            this.changePlaylist(requestPl);
          } else {
            this.changePlaylist(playlists[0] || NEW_PLAYLIST);
          }
        } else if (!this.playlist().isNew) {
          // if the no plid is specified in the url
          // If playlists non-empty set result to playlists
          this.changePlaylist(playlists[0] || NEW_PLAYLIST);
        }

        setResults(playlists);
      }
    } else {
      // setResults([])
      // handlePlaylistClick(NEW_PLAYLIST)()
    }
  },

  async changePlaylist(pl, setWithoutLoading = false) {
    if (!pl.name || setWithoutLoading) {
      return this.playlist(pl);
    }

    // prevent repeated set the same playlist
    if (pl.id === this.playlist().id) return;

    this.playlist({});

    const { data } = await api.getPlaylistById(pl.id);
    this.playlist(data);
    // push plid into url
    uurl.pushSearch({ plid: pl.id });
  },

  playlistToView(id) {
    const plElem = document.getElementById(id);
    if (plElem) {
      plElem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  },
};
