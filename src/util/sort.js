// import React from 'react'
// import { Papa, parse } from 'papaparse'

const termMap = {
  'Winter': 1,
  'Spring': 2,
  'Summer': 3,
  'Fall': 4
}

export const sortFunc = {
  sortByCourseNum: function (course1, course2) {
    const x = course1.num.toLowerCase();
    const y = course2.num.toLowerCase();
    return (x < y) ? -1 : (x > y) ? 1 : 0;
  },
  sortDownByTerm: function (offering1, offering2) {
    const x = offering1.termId;
    const y = offering2.termId;
    return (x < y) ? -1 : (x > y) ? 1 : 0;
  },
  sortUpByTerm: function (offering1, offering2) {
    const x = offering1.termId;
    const y = offering2.termId;
    return (x < y) ? 1 : (x > y) ? -1 : 0;
  },
}




