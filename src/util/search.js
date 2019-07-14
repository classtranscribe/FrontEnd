/**
 * Object for implementing search
 */

import _ from 'lodash'

export const search = {
  getFullNumber: function(courses) {
    var name = ''
    courses.forEach( (course, index) => {
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
          key: offering.offering ? offering.offering.id : offering.id,
          number: this.getFullNumber(offering.courses),
          name: offering.courses[0].courseName,
          description: offering.courses[0].description,
          term: offering.offering.termName,
          section: offering.offering.sectionName
        })
    })
    return source;
  },
  getResult: function(offerings, value) {
    if (!value) return []
    var res = []
    const source = this.getCourseSource(offerings)
    const re = new RegExp(_.escapeRegExp(value), 'i')
    const isMatch = result => re.test(result.number) || re.test(result.term) || re.test(result.section) || re.test(result.name)
    res = _.filter(source, isMatch)
    return res
  },

  displaySearchBar: function(onSearching) {
    if (onSearching) {
      document.getElementById('home-content').classList.remove('hide')
      document.getElementById('home-content').classList.add('fadeIn')

      document.getElementById('search-bar').classList.remove('show')
      document.getElementById('search-bar').classList.add('fadeOut')

      setTimeout(() => {
        document.getElementById('home-content').classList.add('show')
        document.getElementById('home-content').classList.remove('fadeIn')
        document.getElementById('search-bar').classList.add('hide')
        document.getElementById('search-bar').classList.remove('fadeOut')
      }, 200);
    } else {
      document.getElementById('home-content').classList.add('fadeOut')
      document.getElementById('home-content').classList.remove('show')
      
      document.getElementById('search-bar').classList.add('fadeIn')
      document.getElementById('search-bar').classList.remove('hide')
      setTimeout(() => {
        document.getElementById('home-content').classList.add('hide')
        document.getElementById('home-content').classList.remove('fadeOut')
        document.getElementById('search-bar').classList.add('show')
        document.getElementById('search-bar').classList.remove('fadeIn')
        document.getElementById("search").focus();
      }, 200);
    }
  }
}