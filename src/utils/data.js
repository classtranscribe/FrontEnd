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
  /**
   * Remove an elem from an array
   */
  remove: function (array, predicate) {
    return _.remove(array, predicate)
  },
  distinct: function (array, key) {
    return _.uniqBy(array, key)
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
    // console.log(array, id)
    return _.find(array, {id: id}) || 'NOT FOUND';
  },
  find: function(array, json) {
    return _.find(array, json);
  },
  /**
   * Determine whether the array contains the elem
   */
  includes: function (array, elem) {
    return _.includes(array, elem);
  },
  shuffle: function (array) {
    return _.shuffle(array)
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
  },
  /**
   * @returns an array contains exact one key of a json array
   */
  extract: function(array, key) {
    const res = []
    array.forEach( item => {
      res.push(item[key])
    })
    return res
  },
  /**
   * @returns {true} if a and b are equal
   */
  isEqual: function(a, b) {
    return _.isEqual(a, b)
  },
  /**
   * Determine whether a imput email is valid
   */
  isValidEmail: function(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  isValidCourseNumber: function(courseNumber) {
    let courseNumberTester = /([A-Z]{2,})([0-9]{2,})/
    return courseNumberTester.test(courseNumber)
  },
  /**
   * convert a moment obj to a ISO string
   */
  momentToISOString: function(moment) {
    if (typeof moment === 'string') return moment
    const date = moment.toDate()
    date.setUTCHours(0, 0, 0)
    return date.toISOString()
  }
}