import _ from 'lodash';
import { uurl } from './use-url';

export class ClassTranscribeLinks {
  /**
   * Set document.title
   * @param {String} title title to set document.title
   * @param {Boolean} replace true if replace the whole document.title
   */
  title(title, replace = false) {
    let completeTitle = '';
    if (!replace) {
      completeTitle = title ? `${title} | ClassTranscribe` : 'ClassTranscribe';
    }

    document.title = completeTitle;
  }

  // //////////////////////////////////////////////////////////////////////////////
  // Links to pages of ClassTranscribe
  // //////////////////////////////////////////////////////////////////////////////

  /**
   * return current location
   */
  currentUrl() {
    return window.location.href;
  }
  /**
   * to `/home`
   */
  home() {
    return '/home';
  }
  /**
   * to `/home/search`
   */
  search(query) {
    return `/search${ this.createSearch({ q: query })}`;
  }
  /**
   * to `/home/starred`
   */
  starred() {
    return '/home/starred';
  }
  /**
   * to `/home/history`
   */
  history() {
    return '/history';
  }
  /**
   * to `/home/offering/<offering_id>?plid=<playlist_id>&mid=<media_id>`
   * @param {String} id offering id
   * @param {String} plid playlist id (optional)
   * @param {String} mid media id (optional)
   */
  offeringDetail(id, plid, mid) {
    return `/offering/${id}${this.createSearch({ plid, mid })}`;
  }
  /**
   * to `/home/personal-report`
   */
  personalAnalytics() {
    return '/personal-analytics';
  }
  /**
   * to `/admin`
   */
  admin(tab = '') {
    if (tab) tab = `/${ tab}`;
    return `/admin${ tab}`;
  }

  /**
   * to `/auth0-callback`
   */
  auth0Callback() {
    return '/auth0-callback';
  }
  /**
   * to `/cilogon-callback`
   */
  ciLogonCallback() {
    return '/cilogon-callback';
  }

  /**
   * to `/instructor`
   */
  instructor() {
    return '/instructor';
  }

  /**
   * to `/instructor/<offering_id>?plid=<playlist_id>&mid=<media_id>`
   * @param {String} offeringId offering id
   * @param {String} plid playlist id (optional)
   * @param {String} mid media id (optional)
   */
  instOffering(offeringId, plid, mid) {
    return `/instructor/${offeringId}${this.createSearch({ plid, mid })}`;
  }
  /**
   * to `/instructor/new-offering`
   */
  instNewOffering() {
    return '/instructor/new-offering';
  }

  /**
   * to `/media-settings/<media_id>/<tab_name>`
   * @param {String} mediaId media ID
   */
  instMediaSettings(mediaId, tab) {
    return `/media-settings/${mediaId}${tab ? `/${tab}` : ''}`;
  }
  /**
   * to `/media-settings/<media_id>/epub`
   * @param {String} mediaId media ID
   */
  mspEpubSettings(mediaId) {
    return this.instMediaSettings(mediaId, 'epub');
  }
  /**
   * to `/media-settings/<media_id>/trans`
   * @param {String} mediaId media ID
   */
  mspTransSettings(mediaId) {
    return this.instMediaSettings(mediaId, 'trans');
  }

  /**
   * to `/watch?id=<media_id>&begin=<begin_time>`
   * @param {String} id Media ID
   * @param {Object} params search query
   */
  watch(id, params = {}) {
    if (params.begin) {
      params.begin = Math.floor(Number(params.begin));
      if (params.begin <= 0) {
        params.begin = undefined;
      }
    }
    return `/video${this.createSearch({ id, ...params })}`;
  }

  /**
   * to `/404`
   */
  notfound404() {
    return '/404';
  }

  /**
   * to `mailto:classtranscribe@illinois.edu`
   */
  contactUs() {
    return 'mailto:classtranscribe@illinois.edu';
  }

  // //////////////////////////////////////////////////////////////////////////////
  // General URL handlers
  // //////////////////////////////////////////////////////////////////////////////

  /**
   * Compare 2 urls
   * @param {String} href1 a url/pathname
   * @param {String} href2 a url/pathname (default as the `window.location.pathname`)
   */
  isEqual(href1, href2) {
    const href2_ = href2 === undefined ? window.location.pathname : href2;
    return href1 === href2_;
  }

  /**
   * Get parsed query object
   * @param {String} query query string
   */
  useParams(query) {
    if (!query) return {};
    const params = {};

    try {
      const pairs = query.substr(1).split('&');
      pairs.forEach((pair) => {
        const [name = '', value = ''] = pair.split('=');
        params[decodeURIComponent(name)] = decodeURIComponent(value);
      });
    } catch (error) {
      console.error('Invalid query');
    }

    return params;
  }

  /**
   * Create a query based on the values in params
   * @param {Object} params search query's params
   * @param {String} prefix the first char in the query '?' or '#'
   */
  createQuery(params, prefix = '') {
    let query = '';
    const keys = Object.keys(params);
    _.forEach(keys, (key) => {
      if (params[key]) {
        let value = params[key];
        if (typeof value === 'string') {
          value = encodeURIComponent(value);
        }

        query += `&${key}=${value}`;
      }
    });

    query = query.replace('&', '');
    return query ? prefix + query : '';
  }

  /**
   * Get parsed window.location.search query of href
   * @param {String} href default to window.href
   */
  useSearch(href) {
    return this.useParams(
      uurl.isValidUrl(href)
        ? href.substring(href.indexOf('?'), href.length)
        : window.location.search,
    );
  }

  /**
   * Create a window.location.search query
   * @param {Object} params search query's params
   */
  createSearch(params) {
    return this.createQuery(params, '?');
  }

  /**
   * Replace current window.location.search
   * @param {Object} params search query's params
   */
  replaceSearch(params) {
    const query = this.createSearch(params);
    window.history.pushState(null, null, window.location.pathname + query);
  }

  /**
   * Push new value to current window.location.search
   * @param {Object} params search query's params
   */
  pushSearch(params) {
    const allParams = { ...this.useSearch(), ...params };
    const newQuery = this.createSearch(allParams);
    window.history.pushState(null, null, window.location.pathname + newQuery);
  }

  setHash(hash = '#') {
    if (!hash.startsWith('#')) {
      hash = `#${hash}`;
    }

    let aElem = document.createElement('a');
    aElem.href = hash;
    aElem.click();
  }

  /**
   * Create a window.location.hash query
   * @param {Object} params hash query's params
   */
  createHash(params) {
    return this.createQuery(params, '#');
  }
}

export const links = new ClassTranscribeLinks();
