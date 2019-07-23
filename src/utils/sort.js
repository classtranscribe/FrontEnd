/**
 * Object for storing sorting options for Array.sort()
 */


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
  sortVideosByCreatedDate: function (v1, v2) {
    // console.log(1)
    const date1 = v1.media.jsonMetadata.title
    const date2 = v2.media.jsonMetadata.title
    return date1 < date2 ? -1 : date1 > date2 ? 1 : 0
  }
}




