import _ from 'lodash'

const initOffering = {
  offering: {
    sectionName: '',
    termId: '',
    accessType: 0,
    logEventsFlag: true,
    courseName: '',
    description: '',
    id: ''
  },
  courseId: '',
}

export const offControl = {
  externalFunctions: {},
  offering_: initOffering,

  instructors_: [],
  newInstructors_: [],

  courses_: [],
  newCourses_: [],

  init: function(props) {
    const { 
      setOfferings, setOffering, 
    } = props
    this.externalFunctions = { setOfferings, setOffering, }
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
    this.instructors_ = value
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
  save: function(newCourse) {
    if (newCourse) this.createOffering()
    else this.updateOffering()
  },
  createOffering: async function() {
    
  },
  updateOffering: async function() {
    console.log({
      offering: this.offering_,
      addedCourses: this.addedCourses(),
      removedCourses: this.removedCourses(),
      removedInstructors: this.removedInstructors(),
      newInstructors: this.newInstructors_,
    })
  },
}