import _ from 'lodash'
import { api, util, user } from 'utils'

export const setup = {
  externalFunctions: {},

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
    } = props

    this.externalFunctions = { 
      setDeparts, setTerms, setOfferings, setOffering,
      setPlaylists, setPlaylist,
    }
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
    return data
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
  
  parseCourseOfferings: function(courseOfferings, departs, terms) {
    let offerArray = _.map( 
      courseOfferings, 
      co => {
        let { courseNumber, departmentId } = co.course
        let depart = _.find( departs, { id: departmentId } )
  
        let offerings = _.map( 
          co.offerings, 
          off => {
            let term = _.find( terms, { id: off.termId })
            return { ...off, term, depart, courseNumber }
        })
  
        return offerings
    })
  
    let offerIds = _.groupBy(_.flatten(offerArray), 'id')
    let offerings = _.map( offerIds, offs => {
      let off = offs[0]
      let fullNumber = this.getFullNumber(offs)
      off.courseNumber = fullNumber
      return off
    })
  
    console.log('offerings', offerings)
    return offerings
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

      const { setOfferings, setDeparts, setTerms } = this.externalFunctions
      setTerms(terms)
      setDeparts(departments)
      setOfferings(offerings)

      api.contentLoaded()
    } catch (error) {
      const { generalError } = context
      generalError({ header: "Couldn't load courses." })
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
}