import { api, http } from './index'

/**
 * DELETE
 */
export const httpDELETE = {
  deleteData: function (path, id, params) {
    path = id ? `/api/${path}/${id}` : `/api/${path}` 
    return http.delete(path, api.withAuth({ params }))
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
  deleteCourseStaffFromOffering: function(offeringId, userId) {
    return this.deleteData(`UserOfferings/${offeringId}/${userId}`)
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