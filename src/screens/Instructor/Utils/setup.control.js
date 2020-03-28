import _ from 'lodash'
import { api, util, user } from '../../../utils'
import { 
  NEW_OFFERING, NO_OFFERING, 
  LOADING_S_OFF, LOADING_INIT, 
  ARRAY_INIT, ARRAY_EMPTY,
  // NO_PLAYLIST,
  NEW_PLAYLIST,
} from './constants'
import { promptControl } from './prompt.control'

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
      setLoading, setConfirmation, history
    } = props

    this.externalFunctions = { 
      setDeparts, setTerms, setOfferings, setOffering,
      setPlaylists, setPlaylist, 
      setLoading, setConfirmation, history
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
    if (offerings_ === undefined) {
      if (
        this.offerings_ === NO_OFFERING || 
        this.offerings_ === ARRAY_EMPTY ||
        this.offerings_ === ARRAY_INIT
      ) {
        return []
      } else {
        return this.offerings_
      }
    }

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
      // Update the document title w/ offering number
      util.links.title(offering_.courseNumber)
    }
  },
  /**
   * Setup Playlists
   * ********************************************************************************************
   */

  changeOffering: function(offering, updateSearch=true) {
    const { history } = this.externalFunctions

    this.playlists_ = []
    if (offering === NEW_OFFERING) {
      this.offering({})
      // setTimeout(() => setOffering(offering), 100);
    } else {
      this.offering(offering)
    }

    // console.log('o', offering)

    if (updateSearch) {
      let offId = offering.id
      // let query = util.createSearchQuery({ offId })
      history.replace('/instructor/'+offId)
    }
    
    // history.replace(`${window.location.pathname}${query}`)
  },

  newOffering: function() {
    // const { history } = this.externalFunctions
    // history.push(util.links.instNewOffering())
    this.offering(NEW_OFFERING)
  },

  /**
   * Setup Offerings
   * ********************************************************************************************
   */

  checkAuthentication: function() {
    if (!user.isLoggedIn()) {
      user.signin()
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
    return (data.slice() || []).reverse()
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
    if (courseOfferings.length === 0) return []

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
  
    // console.log('offerings', offerings)
    return (offerings.slice() || []).reverse()
  },

  getLinkedUsersByOfferingId: async function(offeringId, callBack) {
    let instructors = []
    let students = []
    try {
      let instsResp = await api.getInstructorsByOfferingId(offeringId)
      let stuResp = await api.getStudentsByOfferingId(offeringId)
      instructors = instsResp.data
      students = stuResp.data
    } catch (error) {
      
    }
    let users = { instructors, students }
    if (callBack) callBack(users)
    return users
  },

  getCourseOfferingsByInstructorId: async function(context) {
    this.errors = []
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
      this.offerings(offerings)

      api.contentLoaded()
    } catch (error) {
      promptControl.error(['load offerings', 'departments', 'and terms'])
    }
  },

  setupOfferings: async function(context) {
    if (this.offerings().length > 0) return;

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

      /** 
       * @TODO 
       * - determine whether to use this 
       */
      // update window hash with playlistId
      // if (playlist_ && playlist_.id) {
      //   window.history.replaceState(
      //     null, null, 
      //     window.location.pathname +
      //     '#pid=' + playlist_.id
      //   )
      // }
    }
  },

  setUpPlaylists: async function(offeringId) {
    try {
      this.playlists_ = ARRAY_INIT
      let { data } = await api.getPlaylistsByOfferingId(offeringId)
      // if switched offering while loading data
      if (data.length > 0 && data[0].offeringId !== setup.offering().id) return

      // otherwise, set playlists
      // _.forEach(data, pl => _.reverse(pl.medias))

      if (data.length === 0) data = ARRAY_EMPTY
      this.playlists(data)
    } catch (error) {
      // Blank
      console.error('Failed to load playlists.')
      promptControl.error(['load playlists.'])
    }
  },

  setupPlaylist: function(
    setResults
  ) {
    let playlists = this.playlists()

    if (playlists !== ARRAY_INIT) {
      if (playlists === ARRAY_EMPTY) { // If there is no playlist
        this.changePlaylist(NEW_PLAYLIST)
        setResults([])
      } else {
        // If playlists non-empty set result to playlists
        if (!this.playlist().isNew) {
          this.changePlaylist(playlists[0] || NEW_PLAYLIST)
        }
        setResults(playlists)
      }
    } else {
      // setResults([])
      // handlePlaylistClick(NEW_PLAYLIST)()
    }
  },

  changePlaylist: async function(pl, setWithoutLoading=false) {
    if (!pl.name || setWithoutLoading) return this.playlist(pl)

    this.playlist({})

    let { data } = await api.getPlaylistById(pl.id)
    this.playlist(data)
    // let pid = data.id
    // window.history.replaceState(null, null, util.links.createHash({ ...util.links.useHash(), pid }))
  },

  playlistToView: function(id) {
    let plElem = document.getElementById(id)
    if (plElem) plElem.scrollIntoView({ behavior: "smooth", block: "nearest" })
  }
}