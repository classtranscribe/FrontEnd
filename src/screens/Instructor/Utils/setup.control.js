import _ from 'lodash'
import { api, util, user } from 'utils'
import { NEW_OFFERING, ARRAY_EMPTY, LOADING_S_OFF, LOADING_INIT } from './constants'

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
  init: function(props) {
    const { 
      setDeparts, setTerms, setOfferings, setOffering,
      setPlaylists, setPlaylist, 
      setLoading, setConfirmation
    } = props

    this.externalFunctions = { 
      setDeparts, setTerms, setOfferings, setOffering,
      setPlaylists, setPlaylist, 
      setLoading, setConfirmation
    }
  },

  loading: function(opt=LOADING_S_OFF) {
    const { setLoading } = this.externalFunctions
    if (setLoading) setLoading(opt)
  },

  unloading: function() {
    this.loading(LOADING_INIT)
  },

  /**
   * 
   * @param {Object} confirmation { title, text, onConfirm }
   */
  confirm: function(confirmation) {
    const { setConfirmation } = this.externalFunctions
    if (setConfirmation) setConfirmation(confirmation)
  },

  offerings: function(offerings_) {
    if (offerings_ === undefined) return this.offerings_
    let { setOfferings } = this.externalFunctions
    if (setOfferings) {
      this.offerings_ = offerings_
      setOfferings(offerings_)
    }
  },
  terms: function(terms_) {
    if (terms_ === undefined) return this.terms_
    let { setTerms } = this.externalFunctions
    if (setTerms) {
      this.terms_ = terms_
      setTerms(terms_)
    }
  },
  departments: function(departments_) {
    if (departments_ === undefined) return this.departments_
    let { setDeparts } = this.externalFunctions
    if (setDeparts) {
      this.departments_ = departments_
      setDeparts(departments_)
    }
  },
  offering: function(offering_) {
    if (offering_ === undefined) return this.offering_
    let { setOffering } = this.externalFunctions
    if (setOffering) {
      this.offering_ = offering_
      setOffering(offering_)
    }
  },
  /**
   * Setup Playlists
   * ********************************************************************************************
   */

  changeOffering: function(offering) {
    const { setOffering, setPlaylists, setPlaylist, } = this.externalFunctions

    if (offering === NEW_OFFERING) {
      this.offering({})
      setTimeout(() => setOffering(offering), 100);
    } else {
      this.offering(offering)
    }
    setPlaylists([])
    setPlaylist({})

    let { offId } = util.parseSearchQuery()
    offId = offering.id
    let query = util.createSearchQuery({ offId })
    window.history.replaceState(null, null, query)
    // history.replace(`${window.location.pathname}${query}`)
  },

  /**
   * Setup Offerings
   * ********************************************************************************************
   */

  checkAuthentication: function() {
    if (!user.isLoggedIn()) {
      user.login()
    } else if (!user.isInstructor()) {
      window.location = util.links.notfound404()
    }
    return true
  },

  getDepartsByUniversityId: async function() {
    let { data } = await api.getDepartsByUniId(user.getUserInfo().universityId)
    return data
  },

  getTermsByUniversityId: async function() {
    let { data } = await api.getTermsByUniId(user.getUserInfo().universityId)
    return data.slice().reverse()
  },

  getFullNumber: function(offs) {
    let fullNumber = ''
    _.forEach( offs, (off, index) => {
      let { courseNumber } = off
      let { acronym } = off.depart
      if (index > 0) fullNumber += '/'
      fullNumber += acronym + courseNumber
    })
  
    return fullNumber
  },
  
  parseCourseOfferings: function(courseOfferings=[], departs, terms) {
    // console.log('rawOfferings', courseOfferings)
    if (courseOfferings.length === 0) return ARRAY_EMPTY

    let offerArray = _.map( 
      courseOfferings, 
      co => {
        let { courseNumber, departmentId } = co.course
        let depart = _.find( departs, { id: departmentId } )
        let offerings = _.map( 
          co.offerings, 
          off => {
            let term = _.find( terms, { id: off.termId })
            return { 
              ...off, term, depart, courseNumber, 
              course: { ...co.course, acronym: depart.acronym, depart }
            }
        })
  
        return offerings
    })
  
    let offerIds = _.groupBy(_.flatten(offerArray), 'id')
    let offerings = _.map( offerIds, offs => {
      let off = offs[0]

      let courses = _.map(offs, o => o.course)
      off.courses = courses

      let fullNumber = this.getFullNumber(offs)
      off.courseNumber = fullNumber

      if (Boolean(off.course)) delete off.course
      if (Boolean(off.depart)) delete off.depart
      return off
    })
  
    console.log('offerings', offerings)
    return offerings
  },

  getInstructorsByOfferingId: async function(offeringId, setInstructors) {
    let instructors = []
    let instructorIds = []
    try {
      let { data } = await api.getOfferingById(offeringId)
      instructors = _.map(data.instructorIds, inst => inst.email)
      instructorIds = _.map(data.instructorIds, inst => ({ email: inst.email, id: inst.id }))
    } catch (error) {
      
    }
    let insts = { instructors, instructorIds }
    if (setInstructors) setInstructors(insts)
    return insts
  },

  getCourseOfferingsByInstructorId: async function(context) {
    try {
      let { data } = await api.getCourseOfferingsByInstructorId(user.userId())
      let departments = await this.getDepartsByUniversityId()
      let terms = await this.getTermsByUniversityId()
      let offerings = this.parseCourseOfferings(data, departments, terms)

      // console.log('offerings', offerings)
      // console.log('departments', departments)
      // console.log('terms', terms)

      this.terms(terms)
      this.departments(departments)
      this.offerings(offerings.slice().reverse())

      api.contentLoaded()
    } catch (error) {
      if (context) {
        const { generalError } = context
        generalError({ header: "Couldn't load courses." })
      }
    }
  },

  setupOfferings: async function(offerings, context) {
    if (offerings > 0) return;

    if (this.checkAuthentication()) {
      await this.getCourseOfferingsByInstructorId(context)
    }
  },


  /**
   * Setup Playlists
   * ********************************************************************************************
   */
  playlists_: [],
  playlist_: {},
  playlists: function(playlists_) {
    if (playlists_ === undefined) {
      if (this.playlists_ === ARRAY_EMPTY) return []
      return this.playlists_
    }
    let { setPlaylists } = this.externalFunctions
    if (setPlaylists) {
      this.playlists_ = playlists_
      setPlaylists(playlists_)
    }
  },

  playlist: function(playlist_) {
    if (playlist_ === undefined) return this.playlist_
    let { setPlaylist } = this.externalFunctions
    if (setPlaylist) {
      this.playlist_ = playlist_
      setPlaylist(playlist_)
    }
  },

  setUpPlaylists: async function(offeringId) {
    try {
      let { data } = await api.getPlaylistsByOfferingId(offeringId)
      // console.error('playlists', data)
      _.forEach(data, pl => _.reverse(pl.medias))

      if (data.length === 0) data = ARRAY_EMPTY
      this.playlists(data)

    } catch (error) {
      
    }
  },

  changePlaylist: function(pl, ms=100) {
    if (ms) {
      this.playlist({})
      setTimeout(() => this.playlist(pl), 100);
    } else {
      this.playlist(pl)
    }
  },
}