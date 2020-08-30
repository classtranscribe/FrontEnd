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
   * to `/sign-in?method=<auth method>&redirect=<redirect-uri>`
   * @param {Object} config - sign in config
   * @param {String} config.redirect - redirect-uri
   * @param {String} config.method - auth method
   */
  signIn(config) {
    const {
      redirect = window.location.href,
      method
    } = config || {};
    return `/sign-in${uurl.createSearch({ redirect, method })}`
  }

  /**
   * to `/`
   */
  home() {
    return '/';
  }
  /**
   * to `/search`
   */
  search(query) {
    return `/search${ uurl.createSearch({ q: query })}`;
  }
  /**
   * to `/history`
   */
  history() {
    return '/history';
  }
  /**
   * to `/offering/<offering_id>?plid=<playlist_id>&mid=<media_id>`
   * @param {String} id offering id
   * @param {String} plid playlist id (optional)
   * @param {String} mid media id (optional)
   */
  offeringDetail(id, plid, mid) {
    return `/offering/${id}${uurl.createHash({ plid, mid })}`;
  }
  /**
   * to `/personal-report`
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

  myCourses() {
    return '/instructor/my-courses';
  }

  playlist(playlistId) {
    return `/playlist/${playlistId}`;
  }

  instNewPlaylist(offeringId) {
    return `/offering/${offeringId}/new-playlist`;
  }

  playlistUploadFiles(playlistId) {
    return `/playlist/${playlistId}/upload-files`;
  }

  instMedia(mediaId) {
    return `/instructor/media/${mediaId}`;
  }

  newCourse() {
    return '/instructor/new-course';
  }

  courseSettings(offeringId) {
    return `/offering/${offeringId}/settings`;
  }

  courseAnalytics(offeringId) {
    return `/offering/${offeringId}/analytics`;
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
    return `/video${uurl.createSearch({ id, ...params })}`;
  }

  /**
   * to `/docs/component-api/<name>`
   * @param {String} name - name of the docs
   */
  componentAPI(name) {
    return `/docs/component-api/${name}`;
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
}

export const links = new ClassTranscribeLinks();
