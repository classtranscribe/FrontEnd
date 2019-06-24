// import React from 'react'
// import { Papa, parse } from 'papaparse'

const termMap = {
  'Winter': 1,
  'Spring': 2,
  'Summer': 3,
  'Fall': 4
}

export const sortFunc = {
  sortByCourseNum: sortByCourseNum,
  sortDownByTerm: sortDownByTerm,
  sortUpByTerm: sortUpByTerm,
}

function sortByCourseNum(course1, course2) {
  const x = course1.num.toLowerCase();
  const y = course2.num.toLowerCase();
  return (x < y) ? -1 : (x > y) ? 1 : 0;
}

function sortDownByTerm(offering1, offering2) {
  const o1 = offering1.term.split(' ');
  const o2 = offering2.term.split(' ');
  const t1 = parseInt(o1[1]), t2 = parseInt(o2[1]);
  if (t1 > t2) return -1;
  else if (t1 === t2 && termMap[o1[0]] > termMap[o2[0]]) return -1;
  else if (t1 < t2) return 1;
  else return 0;
}

function sortUpByTerm(offering1, offering2) {
  const o1 = offering1.term.split(' ');
  const o2 = offering2.term.split(' ');
  const t1 = parseInt(o1[1]), t2 = parseInt(o2[1]);
  if (t1 > t2) return 1;
  else if (t1 === t2 && termMap[o1[0]] < termMap[o2[0]]) return 1;
  else if (t1 < t2) return -1;
  else return 0;
}



