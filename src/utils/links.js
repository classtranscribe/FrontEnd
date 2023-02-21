import { env } from 'utils/env';
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
   * @param {String} config.aspopup - 'true' if served as a popup window and will be closed after signing in
   */
  signIn(config) {
    const {
      redirect = window.location.href,
      method,
      aspopup 
    } = config || {};
    return `/sign-in${uurl.createSearch({ redirect, method, aspopup })}`
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
  course(id, plid, mid) {
    return `/offering/${id}${uurl.createHash({ plid, mid })}`;
  }

  /**
   * to `/personal-report`
   */
  personalAnalytics() {
    return '/personal-analytics';
  }

  /**
   * to `/glossary`
   */
  glossary() {
    return '/glossary';
  }

  /**
   * to `/glossary`
   */
  asl() {
    return '/asl';
  }

  /**
   * to `/watch?id=<media_id>[&begin=<begin_time>`
   * @param {String} id - media id
   * @param {Object} params - search query
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
   * to `/admin/<tab>`
   * @param {String} tab - admin tab
   */
  admin(tab = '') {
    if (tab) tab = `/${ tab}`;
    return `/admin${ tab}`;
  }

  /**
   * to `/instructor`
   */
  instructor() {
    return '/instructor';
  }

  /**
   * to `/instructor/my-courses`
   */
  myCourses() {
    return '/instructor/my-courses';
  }

  /**
   * to `/instructor/new-course`
   */
  newCourse() {
    return '/instructor/new-course';
  }

  /**
   * to `/offering/<offering_id>/settings`
   * @param {String} offeringId - offering id
   */
  courseSettings(offeringId) {
    return `/offering/${offeringId}/settings`;
  }

  /**
   * to `/offering/<offering_id>/analytics`
   * @param {String} offeringId - offering id
   */
  courseAnalytics(offeringId) {
    return `/offering/${offeringId}/analytics`;
  }

  /**
   * to `/offering/<offering_id>/new-playlist`
   * @param {String} offeringId - offering id
   */
  instNewPlaylist(offeringId) {
    return `/offering/${offeringId}/new-playlist`;
  }

  /**
   * to `/playlist/<playlist_id>`
   * @param {String} playlistId - playlist id
   */
  playlist(playlistId) {
    return `/playlist/${playlistId}`;
  }

  /**
   * to `/playlist/<playlist_id>/upload-files`
   * @param {String} playlistId - playlist id
   */
  playlistUploadFiles(playlistId) {
    return `/playlist/${playlistId}/upload-files`;
  }

  /**
   * to `/media-settings/<media_id>/<tab_name>`
   * @param {String} mediaId - media id
   */
  instMediaSettings(mediaId, tab) {
    return `/media-settings/${mediaId}${tab ? `/${tab}` : ''}`;
  }
  
  /**
   * to `/media-settings/<media_id>/epub`
   * @param {String} mediaId - media id
   */
  mspEpubSettings(mediaId) {
    return this.instMediaSettings(mediaId, 'epub');
  }

  /**
   * to `/media-settings/<media_id>/trans`
   * @param {String} mediaId - media id
   */
  mspTransSettings(mediaId) {
    return this.instMediaSettings(mediaId, 'trans');
  }

  /**
   * to `/epub/<ePub_id>[#step=<step>`
   * @param {String} id - ePub id
   */
  epub(id, view, from) {
    return `/epub/${id}${uurl.createHash({ view, from })}`;
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
  
  pgadmin() {
    return `${env.baseURL}/pgadmin/`;
  }
  
  rabbitmq() {
    return `${env.baseURL}/rabbitmq/`;
  }
  
  traefik() {
    return `${env.baseURL}/traefik/`;
  }
  
  swag() {
    return `${env.baseURL}/swag/`;
  }
  /**
   * to `mailto:classtranscribe@illinois.edu`
   */
  contactUs() {
    return 'mailto:classtranscribe@illinois.edu';
  }
}

export const links = new ClassTranscribeLinks();
