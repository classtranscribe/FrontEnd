import _ from 'lodash'

/**
 * Object for needs of manipulating array and json onjects
 */
export const handleData = {
  /**
   * Clone a json or array object
   */
  copy: function (obj) {
    return _.clone(obj)
  },
  remove: function (array, predicate) {
    _.remove(array, predicate)
  },
  /**
   * Update the old json object with changed json (which may not be complete)
   */
  updateJson: function (old, changed) {
    old = handleData.copy(old);
    var res = {};
    for (var key in old) {
      res[key] = old[key] || changed[key];
    }
    return res;
  },
  /**
   * Find the object in array by its id
   */
  findById: function(array, id) {
    return _.find(array, {id: id});
  },
  /**
   * Determine whether the array contains the elem
   */
  includes: function (array, elem) {
    return _.includes(array, elem);
  },
  /**
   * Get a combined course number from an array of courses
   * e.g. ['CS425', 'ECE428'] => 'CS425/CS428'
   */
  getCompleteCourseNumber: function(courses){
    var str = ''
    courses.forEach( (course, index) => {
      const slash = index ? '/' : ''
      str = str + slash + course.courseNumber
    })
    return str
  }
}