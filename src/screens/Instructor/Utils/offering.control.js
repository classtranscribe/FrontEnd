import _ from 'lodash'
import { user, api } from 'utils'
import { 
  LOADING_S_OFF, 
  LOADING_D,
  LOADING_INIT 
} from './constants'
import { setup } from './setup.control'

const initOffering = {
  offering: {
    sectionName: '',
    termId: '',
    accessType: 0,
    logEventsFlag: true,
    courseName: '',
    description: '',
    //id
  },
  courseId: '',
}

export const offControl = {
  externalFunctions: {},
  offering_: initOffering,

  instructors_: [],
  instructorIds_: [],
  newInstructors_: [],

  courses_: [],
  newCourses_: [],

  init: function(props) {
    const { 
      setOfferings, setOffering, 
      setLoading, setIsEditingOffering
    } = props
    this.externalFunctions = { 
      setOfferings, setOffering, 
      setLoading, setIsEditingOffering
    }
  },

  offering: function(off) {
    if (off === undefined) return this.offering_

    let { 
      id,
      termId,  
      courseName,      
      accessType, 
      sectionName, 
      description, 
      logEventsFlag, 
      courses,
    } = off

    this.offering_.offering = {
      id,
      termId,  
      courseName,      
      accessType, 
      sectionName, 
      description, 
      logEventsFlag, 
    }

    this.offering_.courseId = courses[0].id
    this.courses_ = courses
  },

  offeringSet: function(key, value) {
    if (value === undefined) {
      return _.get(this.offering_, key)
    }
    _.set(this.offering_, key, value)
  },

  /**
   * Offering basics
   */
  id: function(value) {
    return this.offeringSet('offering.id', value)
  },

  sectionName: function(value) {
    return this.offeringSet('offering.sectionName', value)
  },

  termId: function(value) {
    return this.offeringSet('offering.termId', value)
  },

  accessType: function(value) {
    return this.offeringSet('offering.accessType', value)
  },

  logEventsFlag: function(value) {
    return this.offeringSet('offering.logEventsFlag', value)
  },

  courseName: function(value) {
    return this.offeringSet('offering.courseName', value)
  },

  description: function(value) {
    return this.offeringSet('offering.description', value)
  },

  courseId: function(value) {
    return this.offeringSet('courseId', value)
  },

  /** 
   * Courses
   */
  courses: function(value) {
    if (value === undefined) return this.courses_
    this.courses_ = value
  },
  newCourses: function(courses) {
    this.newCourses_ = courses
  },
  addedCourses: function() {
    return _.differenceBy(this.newCourses_, this.courses_, 'id')
  },
  removedCourses: function() {
    return _.differenceBy(this.courses_, this.newCourses_, 'id')
  },

  /** 
   * Instructors
   */
  instructors: function(value) {
    if (value === undefined) return this.instructors_
    this.instructors_ = value.instructors
    this.instructorIds_ = value.instructorIds
  },
  newInstructors: function(emails) {
    this.newInstructors_ = emails
  },
  addedInstructors: function() {
    return _.difference(this.newInstructors_, this.instructors_)
  },
  removedInstructors: function() {
    return _.difference(this.instructors_, this.newInstructors_)
  },


  /**
   * Save
   */
  save: function(newCourse, setErrors) {
    if (newCourse) this.createOffering(setErrors)
    else this.updateOffering(setErrors)
  },
  /**
   * Function used for creating an offering
   */
  createOffering: async function(setErrors) {
    const { setLoading } = this.externalFunctions
    try {
      let off = this.offering_
      let courses = this.newCourses_
      let { userId } = user.getUserInfo()
      let staffs = [...this.newInstructors_]

      // check validity
      let errors = []
      let { termId, courseName, sectionName } = off.offering
      if (!termId) errors.push('termId')
      if (!courseName) errors.push('courseName')
      if (!sectionName) errors.push('sectionName')
      if (courses.length === 0) errors.push('courses')
      setErrors(errors)
      console.log('errors', errors)

      if (errors.length > 0) return;
      setLoading(LOADING_S_OFF)

      // create offering
      off.courseId = courses[0].id
      off.instructorId = userId
      let { data } = await api.createOffering(off)
      // console.log('offResp', data)
      console.log('created')
      
      const offeringId = data.id

      // link other courses to this offering
      for (let i = 1; i < courses.length; i++) {
        await api.createCourseOffering({ courseId: courses[i].id, offeringId })
                .catch(error => console.error('failed to add course ' + courses[i].id))
      }
      console.log('added courses')

      // link staffs to this offering
      await api.addCourseStaffToOffering(offeringId, staffs)
              .catch(error => console.error('failed to add staffs'))
      console.log('added staffs')

      // parse new offering
      let newOff = this.parseNewOffering({ offeringId, off, courses, termId })
      // Add this new offering to offerings
      setup.offerings([ newOff, ...setup.offerings() ])

      setLoading(LOADING_INIT)
      // console.log('courseOffering', { offering: off, courses, staffs })

    } catch (error) {
      setLoading(LOADING_INIT)
      console.error('create offering error.')
    }
  },

  /**
   * Function used to update offering info
   */
  updateOffering: async function(setErrors) {
    const { setLoading } = this.externalFunctions

    let off = this.offering_
    let courses = this.newCourses_
    let addedCourses = this.addedCourses()
    let removedCourses = this.removedCourses()
    let addedStaffs = this.addedInstructors()
    let removedStaffs = this.removedInstructors()

    // check validity
    let errors = []
    let { termId, courseName, sectionName } = off.offering
    if (!termId) errors.push('termId')
    if (!courseName) errors.push('courseName')
    if (!sectionName) errors.push('sectionName')
    if (courses.length === 0) errors.push('courses')
    setErrors(errors)
    console.log('errors', errors)

    if (errors.length > 0) return;
    setLoading(LOADING_S_OFF)

    let offeringId = off.offering.id

    // update offering
    console.log('update offering')
    try {
      await api.updateOffering(off.offering)
      console.log('success', off.offering)
    } catch (error) {
      console.error('failed to update offering')
      return;
    }
    
    // link added courses to this offering
    for (let i = 0; i < addedCourses.length; i++) {
      console.log(`adding course ${i + 1} - id: ${addedCourses[i].id}, offId: ${offeringId}`)
      await api.createCourseOffering({ courseId: addedCourses[i].id, offeringId })
              .then(() => console.log('success'))
              .catch(error => {
                console.log('failed', error)
                _.remove(courses, { id: addedCourses[i].id })
                // @TODO Add notification
              })
    }

    // unlink removed courses
    for (let i = 0; i < removedCourses.length; i++) {
      console.log(`removing course ${i + 1} - id: ${removedCourses[i].id}, offId: ${offeringId}`)
      await api.deleteCourseOffering(removedCourses[i].id, offeringId)
              .then(() => console.log('success'))
              .catch(error => {
                console.log('failed')
                courses.push(removedCourses[i])
                // @TODO Add notification
              })
    }

    // link added staffs to this offering
    if (addedStaffs.length > 0) {
      console.log('adding staffs', addedStaffs)
      await api.addCourseStaffToOffering(offeringId, addedStaffs)
            .then(() => console.log('success'))
            .catch(error => console.log('failed to add staffs'))
    }

    // unlink removed staffs
    let instructorIds = this.instructorIds_
    if (removedStaffs.length > 0) {
      console.log('removing staffs', removedStaffs)
      for (let i = 0; i < removedStaffs.length; i++) {
        let instId = _.find(instructorIds, { email: removedStaffs[i] })
        console.log(`remove ${instId.email} - id: ${instId.id}`)
        if (instId) {
          await api.deleteCourseStaffFromOffering(offeringId, instId.id)
                  .catch(error => console.log(`failed to remove staff ${removedStaffs[i]}`))
        }
      }
    }

    try {
      // parse new offering
      let offerings = setup.offerings()
      let newOff = this.parseNewOffering({ offeringId, off, courses, termId })
      let oldOffIdx = _.findIndex(offerings, { id: offeringId })
      if (oldOffIdx < 0) {
        // handle error
      }
      console.log('newOff', newOff)
      offerings[oldOffIdx] = newOff
      setup.offerings([ ...offerings ])
      setup.offering(newOff)
    } catch (error) {
      console.error('failed to create new offering')
    }

    setLoading(LOADING_INIT)
    // window.location = window.location.pathname + window.location.search
  },

  /**
   * Delete Offering
   */
  deleteOffering: async function(offeringId) {
    const { setLoading } = this.externalFunctions
    setLoading(LOADING_D)
    try {
      await api.deleteOffering(offeringId)
      let offerings = setup.offerings()
      _.remove(offerings, { id: offeringId })
      setup.changeOffering(offerings[0])
      setup.offerings([...offerings])

      window.location = window.location.pathname
    } catch(error) {
      setLoading(LOADING_INIT)
      console.error('update offering error.')
    }
  },

  /**
   * Helpers
   */
  parseNewOffering: function({ offeringId, off, courses, termId }) {
    let newOff = { ...off.offering, id: offeringId }
    let term = _.find( setup.terms(), { id: termId })
    newOff.term = term

    _.forEach(courses, (co, index) => {
      let depart = _.find(setup.departments(), { id: co.departmentId })
      co.depart = depart
      co.acronym = depart.acronym
      if (index === 0) newOff.depart = depart
    })
    newOff.courses = courses

    let courseNumber = api.getFullNumber(courses)
    newOff.courseNumber = courseNumber
    
    return newOff
  },
}