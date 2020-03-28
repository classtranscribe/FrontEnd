import { api, http } from './index'

/**
 * DELETE
 */
export const httpDELETE = {
  deleteData: function (path, id, params, data) {
    path = id ? `/api/${path}/${id}` : `/api/${path}` 
    return http.delete(path, api.withAuth({ params, data }))
  },
  // University
  deleteUniversity: function(universityId) {
    return this.deleteData('Universities', universityId)
  },
  // Term
  deleteTerm: function(termId) {
    return this.deleteData('Terms', termId)
  },
  // Department
  deleteDepartment: function(departId) {
    return this.deleteData('Departments', departId)
  },
  // Role
  deleteRole: function(mailId) {
    return this.deleteData('Roles', null, { mailId })
  },
  // Course
  deleteCourse: function(courseId) {
    return this.deleteData('Courses', courseId)
  },
  // Offering
  deleteOffering: function(offeringId) {
    return this.deleteData('Offerings', offeringId)
  },
  deleteCourseOffering: function (courseId, offeringId) {
    return this.deleteData(`CourseOfferings/${courseId}/${offeringId}`)
  },
  deleteInstructorsFromOffering: function(offeringId, data) {
    return this.deleteData(`UserOfferings/DeleteUserFromOffering/${offeringId}/Instructor`, null, null, data)
  },
  deleteStudentsFromOffering: function(offeringId, data) {
    return this.deleteData(`UserOfferings/DeleteUserFromOffering/${offeringId}/Student`, null, null, data)
  },
  // Playlist
  deletePlaylist: function(playlistId) {
    return this.deleteData('Playlists', playlistId)
  },
  // Media
  deleteMedia: function(mediaId) {
    return this.deleteData('Media', mediaId)
  },
}