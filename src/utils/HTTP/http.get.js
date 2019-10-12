import { api, http } from './index'

/**
 * GET
 */
export const httpGET = {
  getFile: function(path) {
    return http.get(path)
  },
  getData: function (path, id, params) {
    path = `/api/${path}`
    if(id) path = `${path}/${id}`
    return http.get(path, api.withAuth({ params }))
  },
  // User Metadata
  getUserMetaData: function() {
    return this.getData('Account/GetUserMetadata/GetUserMetadata')
  },
  // Universities
  getUniversities: function() {
    return this.getData('Universities')
  },
  getUniversityById: function (universityId) {
    return this.getData('Universities', universityId)
  },
  // Terms
  getTermById: function(termId) {
    return this.getData('Terms', termId)
  },
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
  },
  // Departments
  getDepartments: function() {
    return this.getData('Departments')
  },
  getDepartById: function(departId) {
    return this.getData('Departments', departId)
  },
  getDepartsByUniId: function (id) {
    return this.getData('Departments/ByUniversity', id)
  },
  // Courses
  getCourseById: function (courseId) {
    return this.getData('Courses', courseId)
  },
  getCoursesByDepartId: function (id) {
    return this.getData('Courses/ByDepartment', id) 
  },
  getCoursesByInstId: function (id) {
    return this.getData('Courses/ByInstructor', id) 
  },
  // Roles
  getRolesByUniId: function (universityId) {
    return this.getData('Roles', null, {universityId})
  },
  // Offerings
  getOfferingsByStudent: function() {
    return this.getData('Offerings/ByStudent')
  },
  getOfferingById: function(id) {
    return this.getData('Offerings', id)
  },
  getCourseOfferingsByInstructorId: function (id) {
    return this.getData('CourseOfferings/ByInstructor', id)
  },
  // Playlists
  getPlaylistById: function(playlistId) {
    return this.getData('Playlists', playlistId)
  },
  getPlaylistsByOfferingId: function(offeringId) {
    return this.getData('Playlists/ByOffering', offeringId)
  },
  // media
  getMediaById: function(mediaId) {
    return this.getData('Media', mediaId)
  },
  getCaptionsByTranscriptionId: function(transId) {
    return this.getData('Captions/ByTranscription', transId)
  },
  getCaptionLine: function(transcriptionId, index) {
    return this.getData('Captions', null, { transcriptionId, index })
  },
  searchCaptionInOffering: function(offeringId, query) {
    return this.getData('Captions/SearchInOffering', null, { offeringId, query })
  },
  // Admin
  adminGetLogs: function(from, to) {
    return this.getData('Admin/GetLogs', null, { from, to })
  },
  // Logs
  getCourseLogs: function(eventType, offeringId, start, end) {
    return this.getData('Logs/CourseLogs', null, { offeringId, eventType, start, end })
  },
  getStudentLogs: function(eventType, mailId, start, end) {
    return this.getData('Logs/StudentLogs', null, { mailId, eventType, start, end })
  },
}