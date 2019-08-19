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

  parseSearchQuery: function () {
    var queryString = window.location.search
    if (!queryString) return {}
    var query = {}
    var pairs = queryString.substr(1).split('&');
    pairs.forEach( pair => {
      pair = pair.split('=')
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    })
    return query
  },

  links: {
    currentUrl: () => window.location,
    home: ()=> '/home',
    search: () => '/home/search',
    starred: () => '/home/starred',
    offeringDetail: id => `/home/offering/${id}`,
    admin: () => '/admin',

    instructor: () => '/instructor',
    newOffering: id => `/instructor/offering-setting/new=${id}`,
    editOffering: (offeringId) => `/offering/${offeringId}/offering-setting/id=${offeringId}`,

    offering: id => `/offering/${id}`,
    offeringData: offeringId => `/offering/${offeringId}/data`,
    offeringPlaylist: (offeringId, courseName, playlistId) => `/offering/${offeringId}/playlist/${courseName}=${playlistId}`,
    newPlaylist: (offeringId) => `/offering/${offeringId}/playlist-setting/new=${offeringId}`,
    editPlaylist: (offeringId, playlistId) => `/offering/${offeringId}/playlist-setting/id=${playlistId}`,
    uploadVideo: (offeringId, playlistId) => `/offering/${offeringId}/upload/${playlistId}`,
    editVideo: id => `/offering/video-setting/${id}`,

    watch: (courseNumber, mediaId) => `/video?courseNumber=${courseNumber}&id=${mediaId}`,
    notfound404: () => '/404',
  },

  isAuthedPage: function (pathname) {
    // return pathname.includes('instructor') || pathname.slice(0, 9) === '/offering' || pathname.includes('admin') || pathname.includes('video')
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

