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
  offering: initOffering,

  init: function(props) {
    const { setOfferings, setOffering, } = props
    this.externalFunctions = { setOfferings, setOffering, }
  },

  offeringSet: function(key, value) {
    if (value === undefined) {
      return _.get(this.offering, key)
    }
    _.set(this.offering, key, value)
  },

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
}