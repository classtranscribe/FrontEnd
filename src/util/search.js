/**
 * Object for implementing search
 */

import _ from 'lodash'

export const search = {
  getFullNumber: function(courses) {
    var name = ''
    courses.forEach( course => {
      name += course.acronym + course.courseNumber + '/';
    })
    name = name.slice(0, name.length - 1)
    return name
  },
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
          offeringId: offering.id
        })
    })
    return source;
  },
  getResult: function(offerings, value) {
    if (!value) return []
    var res = []
    const source = this.getCourseSource(offerings)
    const re = new RegExp(_.escapeRegExp(value), 'i')
    const isMatch = result => re.test(result.fullNumber) || re.test(result.termName) || re.test(result.courseName)
    res = _.filter(source, isMatch)
    return res
  },
}