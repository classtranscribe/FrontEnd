
const VALID_URL = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i

export class ClassTranscribeLinks {
  /**
   * Set document.title
   * @param {String} title title to set document.title
   * @param {Boolean} replace true if replace the whole document.title
   */
  title(title, replace=false) {
    if (!replace) {
      title = title ? `${title} | ClassTranscribe` : 'ClassTranscribe'
    }
    document.title = title
  }

  ////////////////////////////////////////////////////////////////////////////////
  // Links to pages of ClassTranscribe
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * return current location
   */
  currentUrl() {
    return window.location.href
  }
  /**
   * to `/home`
   */
  home() { return '/home' }
  /**
   * to `/home/search`
   */
  search() { return '/home/search' }
  /**
   * to `/home/starred`
   */
  starred() { return '/home/starred' }
  /**
   * to `/home/history`
   */
  history() { return '/home/history' }
  /**
   * to `/home/offering/<offering_id>?plid=<playlist_id>&mid=<media_id>`
   * @param {String} id offering id
   * @param {String} plid playlist id (optional)
   * @param {String} mid media id (optional)
   */
  offeringDetail(id, plid, mid) { 
    return `/home/offering/${id}` + this.createSearch({ plid, mid })
  }
  /**
   * to `/home/personal-report`
   */
  personalAnalytics() { return '/home/personal-report' }
  /**
   * to `/admin`
   */
  admin() { return'/admin' }

  /**
   * to `/login`
   */
  signin() { return'/login' }
  /**
   * to `/logout`
   */
  logout() { return'/logout' }

  /**
   * to `/instructor`
   */
  instructor() { return'/instructor' }
  /**
   * to `/instructor/<offering_id>?plid=<playlist_id>&mid=<media_id>`
   * @param {String} offeringId offering id
   * @param {String} plid playlist id (optional)
   * @param {String} mid media id (optional)
   */
  instOffering(offeringId, plid, mid) {
    return `/instructor/${offeringId}` + this.createSearch({ plid, mid })
  }
  /**
   * to `/instructor/new-offering`
   */
  instNewOffering() { return `/instructor/new-offering` } 
  
  /**
   * to `/media-settings/<media_id>/<tab_name>`
   * @param {String} mediaId media ID
   */
  instMediaSettings = (mediaId, tab) => '/media-settings/' + mediaId + (tab ? `/${tab}` : '')
  /**
   * to `/media-settings/<media_id>/epub`
   * @param {String} mediaId media ID
   */
  mspEpubSettings(mediaId) { return this.instMediaSettings(mediaId, 'epub') }
  /**
   * to `/media-settings/<media_id>/trans`
   * @param {String} mediaId media ID
   */
  mspTransSettings(mediaId) { return this.instMediaSettings(mediaId, 'trans') }

  /**
   * to `/watch?id=<media_id>&begin=<begin_time>`
   * @param {String} id Media ID
   * @param {Object} params search query
   */
  watch(id, params={}) {
    if (params.begin) {
      params.begin = Math.floor(Number(params.begin))
      if (params.begin <= 0) {
        params.begin = undefined
      }
    }
    return '/video' + this.createSearch({ id, ...params })
  }
    

  /**
   * to `/404`
   */
  notfound404() { return'/404' }

  /**
   * to `mailto:classtranscribe@illinois.edu`
   */
  contactUs() { return'mailto:classtranscribe@illinois.edu' }



  ////////////////////////////////////////////////////////////////////////////////
  // General URL handlers
  ////////////////////////////////////////////////////////////////////////////////

  /**
   * Compare 2 urls
   * @param {String} href1 a url/pathname
   * @param {String} href2 a url/pathname (default as the `window.location.pathname`)
   */
  isEqual(href1, href2) {
    if (href2 === undefined) {
      href2 = window.location.pathname
    }

    return href1 === href2
  }
  /**
   * Validate the url
   * @param {String} url a url to validate
   */
  isValidUrl(url) {
    return VALID_URL.test(url)
  }

  /**
   * Get parsed query object
   * @param {String} query query string
   */
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

  /**
   * Create a query based on the values in params
   * @param {Object} params search query's params
   * @param {String} prefix the first char in the query '?' or '#'
   */
  createQuery(params, prefix='') {
    var query = ''
    for(let key in params) {
      if (!params[key]) continue

      let value = params[key]
      if (typeof value === 'string') value = value.replace(/\//g, '-')
      query += `&${key}=${value}`
    }
    query = query.replace('&', '')
    return query ? (prefix + query) : ''
  }

  /**
   * Get parsed window.location.search query of href
   * @param {String} href default to window.href
   */
  useSearch(href) {
    return this.useParams(
      this.isValidUrl(href)
      ?
      href.substring(href.indexOf('?'), href.length)
      :
      window.location.search
    )
  }

  /**
   * Create a window.location.search query
   * @param {Object} params search query's params
   */
  createSearch(params) {
    return this.createQuery(params, '?')
  }

  /**
   * Replace current window.location.search
   * @param {Object} params search query's params
   */
  replaceSearch(params) {
    let query = this.createSearch(params)
    window.history.pushState(null, null, window.location.pathname + query)
  }

  /**
   * Push new value to current window.location.search
   * @param {Object} params search query's params
   */
  pushSearch(params) {
    params = { ...this.useSearch(), ...params }
    let newQuery = this.createSearch(params)
    window.history.pushState(null, null, window.location.pathname + newQuery)
  }

  /**
   * Get parsed window.location.hash query of href
   * @param {String} href default to window.href
   */
  useHash(href) {
    return this.useParams(
      this.isValidUrl(href)
      ?
      href.substring(href.indexOf('#'), href.length)
      :
      window.location.hash
    )
  }

  /**
   * Create a window.location.hash query
   * @param {Object} params hash query's params
   */
  createHash(params) {
    return this.createQuery(params, '#')
  }
}

export const links = new ClassTranscribeLinks()