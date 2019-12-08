import $ from 'jquery'
import { storage } from './storage'

export { search } from './search'
export { user   } from './user'
export { sortFunc } from './sort'
export { handleData } from './data'
export { api    } from './HTTP'


/**
 * Objects for switching pages and storing some general functions
 */
export const util = {
  ...storage,
  links: {
    title: title => {
      document.title = title ? `${title} | ClassTranscribe` : 'ClassTranscribe'
    },
    currentUrl: () => window.location,
    home: () => '/home',
    search: () => '/home/search',
    starred: () => '/home/starred',
    history: () => '/home/history',
    offeringDetail: id => `/home/offering/${id}`,
    personalAnalytics: () => "/home/personal-report",
    admin: () => '/admin',

    login: () => '/login',
    logout: () => '/logout',

    instructor: () => '/instructor',
    newOffering: id => `/instructor/offering-setting/new=${id}`,
    editOffering: (offeringId) => `/offering/${offeringId}/offering-setting/id=${offeringId}`,

    offering: id => `/offering/${id}`,
    offeringData: offeringId => `/offering/${offeringId}/data`,
    offeringPlaylist: (offeringId, courseName, playlistId) => `/offering/${offeringId}/playlist/${courseName}=${playlistId}`,
    newPlaylist: (offeringId) => `/offering/${offeringId}/playlist-setting/new=${offeringId}`,
    editPlaylist: (offeringId, playlistId) => `/offering/${offeringId}/playlist-setting/id=${playlistId}`,
    uploadVideo: (offeringId, playlistId) => `/offering/${offeringId}/upload/${playlistId}`,
    renameVideo: (offeringId, mediaId) => `/offering/${offeringId}/video-rename/${mediaId}`,

    watch: (courseNumber, id, begin) => `/video${util.createSearchQuery({ courseNumber, id, begin: Math.floor(begin)})}`,
    notfound404: () => '/404',
    contactUs: () => 'mailto:classtranscribe@illinois.edu',
  },

  refresh: function() {
    document.location.reload(true);
  },
  scrollToTop: function(div) {
    $(div)[0].scrollTop = 0
  },
  scrollToCenter: function(id, focus=true, alter) {
    const currElem = document.getElementById(id)
    if (currElem) {
      currElem.scrollIntoView({ block: "center" })
      if (focus) currElem.focus()
    } else if (alter) {
      alter()
    }
  },
  parseSearchQuery: function (href) {
    var queryString = window.location.search
    if (href) {
      queryString = href.substring(href.indexOf('?'), href.length)
    }
    if (!queryString) return {}
    var query = {}
    var pairs = queryString.substr(1).split('&');
    pairs.forEach( pair => {
      pair = pair.split('=')
      query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    })
    return query
  },
  createSearchQuery: function(obj) {
    var query = '?'
    for(let key in obj) {
      if (!Boolean(obj[key])) continue;
      let value = obj[key]
      if (typeof value === 'string') value = this.getValidURLFullNumber(value)
      query += (query === '?' ? '' : '&') + `${key}=${value}`
    }
    return query === '?' ? '' : query
  },
  replacePathname: function(url) {
    window.history.replaceState(
      window.history.state , 
      document.title, 
      url
    )
  },
  getWindowStates: function () {
    return window.history.state || {}
  },

  getSelectOptions: function(array, tag) {
    var options = [];
    array.forEach( item => {
      var text = ''
      if ((tag === 'depart' || tag === 'term') && item.uniName) text = `${item.name} (${item.uniName})`
      else text = item.name || tag + item.courseNumber;
      options.push({text: text, value: item.id})
    })
    return options;
  },

  getFittedName: function(name, charNum) {
    if (!name) return 'unknown'

    let fittedName = name.slice(0, charNum)
    if (fittedName !== name) fittedName += '...'
    return fittedName
  },
  getValidURLFullNumber: function(fullNumber) {
    return fullNumber.replace(/\//g, '-')
  },
  parseURLFullNumber: function(fullNumber) {
    fullNumber = fullNumber || util.parseSearchQuery().courseNumber
    return fullNumber.replace(/-/g, '/')
  },

  fixForAccessbitity: function(category) {
    switch (category) {
      case 'widgets/scripts':
        $('.default').each(
          (index, elem) => {
            elem.removeAttribute('aria-live')
            elem.removeAttribute('role')
          }
        )
        break;
      case 'formSearchDropdown':
        $('.search').each(
          (index, elem) => {
            elem.setAttribute('aria-label', 'search' + index)
          }
        )
        break;
      default:
        break;
    }    
  },
}

