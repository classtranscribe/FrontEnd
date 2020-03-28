import { api, http } from './index'
import { deviceType, osVersion, osName, fullBrowserVersion, browserName } from 'react-device-detect'
import { user } from '../user'

/**
 * POST
 */
export const httpPOST = {
  postData: function (path, data, params, otherConfigs) {
    path = `/api/${path}`
    return http.post(path, data, api.withAuth({ params, ...otherConfigs }))
  },
  // User Metadata
  postUserMetaData: function(metadata={}, onboard={}) {
    return this.postData('Account/PostUserMetadata/PostUserMetadata', { metadata, onboard })
  },
  // Universities
  createUniversity: function(data) {
    return this.postData('Universities', data)
  },
  // Terms
  createTerm: function(data) {
    return this.postData('Terms', data)
  },
  // Departments
  createDepartment: function(data) {
    return this.postData('Departments', data)
  },
  // Roles
  createRole: function (mailId) {
    return this.postData('Roles', undefined, { mailId })
  },
  // Courses
  createCourse: function(data) {
    return this.postData('Courses', data)
  },

  // Offerings
  createOffering: function(data) {
    return this.postData('Offerings', data)
  },
  createCourseOffering: function (data) {
    return this.postData('CourseOfferings', data)
  },
  addInstructorsToOffering: function (offeringId, data) {
    return this.postData(`UserOfferings/AddUsers/${offeringId}/Instructor`, data)
  },
  addStudentsToOffering: function (offeringId, data) {
    console.error('addedStudents', data)
    return this.postData(`UserOfferings/AddUsers/${offeringId}/Student`, data)
  },

  // Playlists
  createPlaylist: function(data) {
    return this.postData('Playlists', data)
  },
  // Medias
  uploadVideo: function (playlistId, video1, video2, onUploadProgress) {
    const formData = new FormData()
    formData.append('video1', video1)
    formData.append('video2', video2)
    formData.append('playlistId', playlistId)
    // console.log('uploadData', {playlistId, video1, video2})
    return this.postData('Media', formData, null, { onUploadProgress })
  },
  // Captions
  updateCaptionLine: function(data) {
    return this.postData('Captions', { id: data.id, text: data.text })
  },
  captionUpVote: function(id) { // captionId
    return this.postData('Captions/UpVote', null, { id })
  },
  captionCancelUpVote: function(id) { // captionId
    return this.postData('Captions/CancelUpVote', null, { id })
  },
  captionDownVote: function(id) { // captionId
    return this.postData('Captions/DownVote', null, { id })
  },
  captionCancelDownVote: function(id) { // captionId
    return this.postData('Captions/CancelDownVote', null, { id })
  },

  /**
   * 
   * @param {} eventType 
   * timeupdate, play, pause, seeking, seeked, changedspeed, fullscreenchange, 
   * filtertrans, edittrans, sharelink
   * selectcourse, userinactive, changevideo
   * @param {*} data 
   * { offeringId, mediaId, json }
   */
  sendUserAction: function(eventType, data = {}) {
    // console.log({eventType, ...data, userId: api.userId() })
    const { json, mediaId, offeringId } = data
    return this.postData('Logs', {
      eventType, 
      mediaId, 
      offeringId,
      userId: user.userId(),
      json: {
        ...json, 
        device: { deviceType, osVersion, osName, fullBrowserVersion, browserName }
      }
    })
  },
}