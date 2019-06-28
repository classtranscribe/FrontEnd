export { auth   } from './Auth'
export { api    } from './http'
export { search } from './search'
export { user   } from './user'
export { sortFunc } from './sort'
export { handleData } from './data'

export const util = {
  refresh: function() {
    document.location.reload(true);
  },
  getSelectOptions: function(array, tag) {
    var options = [];
    array.forEach( item => {
      const text = item.name || tag + item.courseNumber + ' ' + item.courseName;
      options.push({text: text, value: item.id})
    })
    return options;
  },
}

