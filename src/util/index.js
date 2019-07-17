import { user } from './user'

export { auth   } from './Auth'
export { api    } from './http'
export { search } from './search'
export { user   } from './user'
export { sortFunc } from './sort'
export { handleData } from './data'



/**
 * Objects for switching pages and storing some general functions
 */
export const util = {
  refresh: function() {
    document.location.reload(true);
  },
  getSelectOptions: function(array, tag) {
    var options = [];
    array.forEach( item => {
      var text = ''
      if ((tag === 'depart' || tag === 'term') && item.uniName) text = `${item.name} (${item.uniName})`
      else text = item.name || tag + item.courseNumber + ' ' + item.courseName;
      options.push({text: text, value: item.id})
    })
    return options;
  },

  links: {
    currentUrl: () => window.location,
    home: ()=> user.isLoggedIn() ? '/student/home' : '/home',
    search: () => user.isLoggedIn() ? '/student/home/search' : '/home/search',
    offeringDetail: id => user.isLoggedIn() ? `/student/home/offering/${id}` : `/home/offering/${id}`,
    admin: () => '/admin',

    student: () => '/student',
    studentSearch: () => '/student/search',
    studentHome: () => '/student/home',
    studentStarred: () => '/student/starred',

    instructor: () => '/instructor',
    newOffering: id => `/instructor/offering-setting/new=${id}`,
    editOffering: id => `/offering/offering-setting/id=${id}`,

    offering: id => `/offering/${id}`,
    newPlaylist: id => `/offering/playlist-setting/new=${id}`,
    editPlaylist: id => `/offering/playlist-setting/id=${id}`,
    uploadVideo: id => `/offering/upload/${id}`,
    editVideo: id => `/offering/video-setting/${id}`,

    video: id => '/video',
  },

  /**
   * Functions for switching pages
   */
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

