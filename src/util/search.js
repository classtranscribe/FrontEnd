/**
 * Object for implementing search
 */

import { fakeData } from '../data'
const courses = fakeData.courses;

export const search = {
  getCourseSource: () => {
    var source = [];
    courses.forEach( course => 
      source.push({
        title: course.num + ' ' + course.term, 
        price: course.sec, 
        description: course.name,
        link: courses.link,
        num: course.num,
        term: course.term,
      })
    )
    return source;
  },

}