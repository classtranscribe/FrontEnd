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
  goHome: () => window.location='/',
  toInstructorPage: () => window.location='/instructor',
  toStudentPage: () => window.location='/student',
  toAdminPage: ()=> window.location='/admin',
  toOfferingPage: function (id) {
    window.location=`/offering/${id}`
  },

  watch: function (id) { // video id
    // window.location=`/video/watch=${id}`
    window.location='/video'
  },
  uploadVideo: function (id) { // playlist id
    window.location=`/offering/upload/${id}`
  },
  editVideo: function (id) { // video id
    window.location=`/offering/video-setting/${id}`
  },
  newPlaylist: function (id) { // offering id
    window.location=`/offering/playlist-setting/new=${id}`
  },
  editPlaylist: function (id) { // playlist id
    window.location=`/offering/playlist-setting/id=${id}`
  },
  newOffering: function (id) { // instructor id
    window.location=`/instructor/offering-setting/new=${id}`
  },
  editOffering: function (id) { // offering id
    window.location=`/instructor/offering-setting/id=${id}`
  }
}

