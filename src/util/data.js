import _ from 'lodash'

export const handleData = {
  copy: function (json) {
    return _.clone(json)
  },
  updateJson: function (old, changed) {
    var old = handleData.copy(old);
    var res = {};
    for (var key in old) {
      res[key] = old[key] || changed[key];
    }
    return res;
  },
  findById: function(array, id) {
    return _.find(array, {id: id});
  },
  includes: function (array, elem) {
    return _.includes(array, elem);
  },
  getCompleteCourseNumber: function(courses){
    var str = ''
    courses.forEach( (course, index) => {
      const slash = index ? '/' : ''
      str = str + slash + course.courseNumber
    })
    return str
  }
}