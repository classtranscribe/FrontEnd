import _ from 'lodash'
import { user, api } from '../../../utils'
import { LOADING_D } from './constants'
import { setup } from './setup.control'
import { promptControl } from './prompt.control'

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

  students_: [],
  studentIds_: [],
  newStudents_: [],

  courses_: [],
  newCourses_: [],

  init: function(props) {
    const { 
      setOfferings, setOffering, setIsEditingOffering
    } = props
    this.externalFunctions = { 
      setOfferings, setOffering, setIsEditingOffering
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
   * Students
   */
  students: function(value) {
    if (value === undefined) return this.students_
    this.students_ = value.students || []
  },
  newStudents: function(emails) {
    this.newStudents_ = emails
  },
  addedStudents: function() {
    return _.difference(this.newStudents_, this.students_)
  },
  removedStudents: function() {
    return _.difference(this.students_, this.newStudents_)
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
    let off = this.offering_
    let courses = this.newCourses_
    let { userId } = user.getUserInfo()
    let staffs = [...this.newInstructors_]
    let students = [...this.newStudents_]

    // check validity
    let errors = []
    let { termId, courseName, sectionName } = off.offering
    if (!termId) errors.push('termId')
    if (!courseName) errors.push('courseName')
    if (!sectionName) errors.push('sectionName')
    if (courses.length === 0) errors.push('courses')
    setErrors(errors)
    // console.log('errors', errors)

    if (errors.length > 0) return;

    /** Begin to save */
    errors = []
    setup.loading()

    // create offering
    // console.log('create offering')
    let offeringId = null
    try {
      off.courseId = courses[0].id
      off.instructorId = userId

      let { data } = await api.createOffering(off)
      // console.log('success', off.offering)

      offeringId = data.id
    } catch (error) {
      promptControl.failedToSave('course')
      console.error('failed to create offering', off)
      setup.unloading()
      return;
    }

    // link other courses to this offering
    // console.log('adding courses')
    for (let i = 1; i < courses.length; i++) {
      await api
            .createCourseOffering({ courseId: courses[i].id, offeringId })
            .catch( error => {
              errors.push('add courses')
              console.error('failed to add course ' + courses[i].id)
            })
    }
    

    // link staffs to this offering'
    // console.log('adding staffs')
    if (staffs.length > 0) {
      await api
            .addInstructorsToOffering(offeringId, staffs)
            .catch(error => {
              errors.push('add staffs')
              console.error('failed to add staffs')
            })
    }

    // link students to this offering'
    // console.log('adding students')
    if (students.length > 0) {
      await api
            .addStudentsToOffering(offeringId, students)
            .catch(error => {
              errors.push('add students')
              console.error('failed to add students')
            })
    }

    try {
      // parse new offering
      let newOff = this.parseNewOffering({ offeringId, off, courses, termId })
      // Add this new offering to offerings
      setup.offerings([ newOff, ...setup.offerings() ])
      setup.changeOffering(newOff)
      // console.error([ newOff, ...setup.offerings() ])
    } catch (error) {
      console.error('failed to parse new offering object')
    }

    setup.unloading()
    promptControl.error(errors)
    // console.log('courseOffering', { offering: off, courses, staffs })
  },

  /**
   * Function used to update offering info
   */
  updateOffering: async function(setErrors) {
    let off = this.offering_
    let courses = this.newCourses_
    let addedCourses = this.addedCourses()
    let removedCourses = this.removedCourses()

    let addedStaffs = this.addedInstructors()
    let removedStaffs = this.removedInstructors()
    let addedStudents = this.addedStudents()
    let removedStudents = this.removedStudents()

    // check validity
    let errors = []
    let { termId, courseName, sectionName } = off.offering
    if (!termId) errors.push('termId')
    if (!courseName) errors.push('courseName')
    if (!sectionName) errors.push('sectionName')
    if (courses.length === 0) errors.push('courses')
    setErrors(errors)
    // console.log('errors', errors)

    if (errors.length > 0) return;
    setup.loading()

    let offeringId = off.offering.id

    // update offering
    // console.log('update offering')
    try {
      await api.updateOffering(off.offering)
      // console.log('success', off.offering)
    } catch (error) {
      console.error('failed to update offering')
      return;
    }
    
    // link added courses to this offering
    for (let i = 0; i < addedCourses.length; i++) {
      // console.log(`adding course ${i + 1} - id: ${addedCourses[i].id}, offId: ${offeringId}`)
      await api.createCourseOffering({ courseId: addedCourses[i].id, offeringId })
              // .then(() => console.log('success'))
              .catch(error => {
                console.error('failed to add the course.', error)
                _.remove(courses, { id: addedCourses[i].id })
              })
    }

    // unlink removed courses
    for (let i = 0; i < removedCourses.length; i++) {
      // console.log(`removing course ${i + 1} - id: ${removedCourses[i].id}, offId: ${offeringId}`)
      await api.deleteCourseOffering(removedCourses[i].id, offeringId)
              // .then(() => console.log('success'))
              .catch(error => {
                console.error('failed to remove the course.')
                courses.push(removedCourses[i])
              })
    }

    // link added staffs to this offering
    if (addedStaffs.length > 0) {
      // console.log('adding staffs', addedStaffs)
      await api.addInstructorsToOffering(offeringId, addedStaffs)
            // .then(() => console.log('success'))
            .catch(error => console.error('failed to add staffs'))
    }

    // link added students to this offering
    addedStudents = _.filter(addedStudents, email => !this.newInstructors_.includes(email))
    if (addedStudents.length > 0) {
      // console.log('adding students', addedStudents)
      await api.addStudentsToOffering(offeringId, addedStudents)
            // .then(() => console.log('success'))
            .catch(error => console.error('failed to add students'))
    }

    // unlink removed staffs
    // let instructorIds = this.instructorIds_
    if (removedStaffs.length > 0) {
      // console.log('removing staffs', removedStaffs)
      await api.deleteInstructorsFromOffering(offeringId, removedStaffs)
              .catch(error => console.error(`failed to remove staffs ${removedStaffs}`))
    }

    // unlink removed students
    // let studentIds = this.studentIds_
    if (removedStudents.length > 0) {
      await api.deleteStudentsFromOffering(offeringId, removedStudents)
              .catch(error => console.error(`failed to remove students ${removedStudents}`))
    }


    try {
      // parse new offering
      let offerings = setup.offerings()
      let newOff = this.parseNewOffering({ offeringId, off, courses, termId })
      let oldOffIdx = _.findIndex(offerings, { id: offeringId })
      if (oldOffIdx < 0) {
        // handle error
      }
      // console.log('newOff', newOff)
      offerings[oldOffIdx] = newOff
      setup.offerings([ ...offerings ])
      setup.offering(newOff)
    } catch (error) {
      console.error('failed to parse new offering.')
    }

    setup.unloading()
  },

  /**
   * Delete Offering
   */
  deleteOffering: async function(offeringId) {
    setup.loading(LOADING_D)
    try {
      await api.deleteOffering(offeringId)
      // let offerings = setup.offerings()
      // _.remove(offerings, { id: offeringId })
      // setup.offerings([...offerings])
      // setup.offering(offerings[0])
      // setup.changeOffering(offerings[0])

      window.location = window.location.pathname
    } catch(error) {
      console.error('failed to delete the offering.')
    }
    setup.unloading()
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