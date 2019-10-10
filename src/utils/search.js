/**
 * Functions for searching
 */

import _ from 'lodash'

export const search = {
  /**
   * Function for generating a full course number from an array of courses
   */
  getFullNumber: function(courses) {
    var name = ''
    courses.forEach( course => {
      name += course.acronym + course.courseNumber + '/';
    })
    name = name.slice(0, name.length - 1)
    return name
  },
  /**
   * Function for converting a courseOffering into an object 
   * which is compatible to the OfferingDetail screen
   */
  getCourseSource: function(offerings) {
    var source = [];
    offerings.forEach( offering => {
      if (offering.courses) 
        source.push({
          ...offering.courses[0],
          key: offering.id || offering.offering.id,
          fullNumber: this.getFullNumber(offering.courses),
          termName: offering.offering.termName,
          section: offering.offering.sectionName,
          accessType: offering.offering.accessType,
          offeringId: offering.id
        })
    })
    return source;
  },
  /**
   * Function for get search results based on the input value
   */
  getResult: function(offerings, value) {
    if (!value) return []
    const source = this.getCourseSource(offerings)
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.fullNumber) || re.test(result.termName) || re.test(result.courseName)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    return _.filter(source, isMatch)
  },

  getInstructorResult: function(instructors, value) {
    if (!value) return instructors
    const tests = []
    // get test functions for each word
    value.split(' ').forEach( word => {
      const re = new RegExp(_.escapeRegExp(word), 'i')
      const test = result => re.test(result.firstName) || re.test(result.lastName) || re.test(result.email)
      tests.push(test)
    })
    // combine the test result
    const isMatch = result => {
      var match = true
      tests.forEach( test => match = match && test(result))
      return match
    }

    return _.filter(instructors, isMatch)
  },

  generalSearch: function(array, value, key) {
    if (!value) return array
    const re = new RegExp(_.escapeRegExp(value), 'i')
    const isMatch = word => re.test(key ? word[key] : word)
    return _.filter(array, isMatch)
  },
}