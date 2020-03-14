
const VALID_URL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

export class ClassTranscribeLinks {
  title = function(title, replace=false) {
    if (!replace) {
      title = title ? `${title} | ClassTranscribe` : 'ClassTranscribe'
    }
    document.title = title
  }

  currentUrl = function() {
    return window.location
  }
  home() { return'/home' }
  search() { return'/home/search' }
  starred() { return'/home/starred' }
  history() { return'/home/history' }
  offeringDetail(id) { return `/home/offering/${id}` }
  personalAnalytics() { return"/home/personal-report" }
  admin() { return'/admin' }

  signin() { return'/login' }
  logout() { return'/logout' }

  instructor() { return'/instructor' }
  instOffering(offeringId) { return `/instructor?offId=${offeringId}` }
  // newOffering = function() `/instructor?offId=ip-new-offering`
  instMediaSettings = (mediaId, tab) => '/instructor/media-settings/' + mediaId + (tab ? `#tab=${tab}` : '')

  watch(courseNumber, id, begin, others={}) {
    return `/video${this.createSearch({ 
      courseNumber, 
      id, 
      begin: Math.floor(begin), ...others 
    })}`
  }
    

  notfound404() { return'/404' }
  contactUs() { return'mailto:classtranscribe@illinois.edu' }

  isValidUrl(value) {
    return VALID_URL.test(value);
  }

  useParams(query) {
    if (!query) return {}
    var params = {}
    
    try {
      var pairs = query.substr(1).split('&');
      pairs.forEach( pair => {
        pair = pair.split('=')
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
      })
    } catch (error) {
      console.error('Invalid query')
    }

    return params
  }
  createQuery(params, prefix='') {
    var query = ''
    for(let key in params) {
      if (!params[key]) continue

      let value = params[key]
      if (typeof value === 'string') value = value.replace(/\//g, '-')
      query += `&${key}=${value}`
    }
    return prefix + query.replace('&', '')
  }

  useSearch(href) {
    return this.useParams(
      this.isValidUrl(href)
      ?
      href.substring(href.indexOf('?'), href.length)
      :
      window.location.search
    )
  }
  createSearch(params) {
    return this.createQuery(params, '?')
  }

  useHash(href) {
    return this.useParams(
      this.isValidUrl(href)
      ?
      href.substring(href.indexOf('#'), href.length)
      :
      window.location.hash
    )
  }
  createHash(params) {
    return this.createQuery(params, '#')
  }
}

export const links = new ClassTranscribeLinks()