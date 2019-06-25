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
  getSelectOptions: function(unis) {
    var options = [];
    unis.forEach( uni => {
      options.push({text: uni.name, value: uni.id})
    })
    return options;
  },
}

