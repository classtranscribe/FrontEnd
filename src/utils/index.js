import $ from 'jquery'
import { storage } from './storage'
import { links   } from './links'

export { env              } from './env'
export { search           } from './search'
export { user, userAction } from './user'
export { handleData       } from './data'
export { api              } from './HTTP'

export * from './constants'

export { CTPreference } from './js/CTPreference'


/**
 * Objects for switching pages and storing some general functions
 */
export const util = {
  ...storage,
  links: links,

  refresh: function() {
    document.location.reload(true);
  },
  scrollToTop: function(div) {
    $(div).scrollTop(0)
  },
  scrollToView: function(query) {
    let div = $(query)
    div.scrollTop = div.offset().top + div.height() / 2;
  },
  scrollToCenter: function(query, focus=true, alter) {
    let div = $(query)
    if (div.length > 0) {
      div.scrollTop = div.offset().top + div.height() / 2;
      if (focus) div.focus()
    } else if (alter) {
      alter()
    }
  },
  parseSearchQuery: function (href) {
    var queryString = window.location.search
    if (href) {
      if (href[0] !== '?' && !this.isValidUrl(href)) return {};
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

  getSelectOptions: function(array=[], tag) {
    if (!Array.isArray(array)) return []
    var options = []
    array.forEach( item => {
      if (!item || !item.id) return
      var text = ''
      if ((tag === 'depart' || tag === 'term') && item.uniName) {
        text = `${item.name} (${item.uniName})`
      } else {
        text = item.name || tag + item.courseNumber
      }
      options.push({text: text, value: item.id})
    })
    return options
  },

  getFittedName: function(name, charNum) {
    if (!name) return ''

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

  preventBreakLine(e={}) {
    if (e.keyCode === 13) e.preventDefault()
  },

  /**
   * Determine whether a imput email is valid
   */
  isValidEmail: function(email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return re.test(email)
  },
  isValidUrl: function(value) {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(value);
  },
}

