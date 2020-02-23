import { api, http } from './index'

/**
 * PUT
 */
export const httpPUT = {
  updateData: function (path, data, id) {
    path = `/api/${path}`
    if (!id) id = data.id
    return http.put(`${path}/${id}`, data, api.withAuth())
  },
  updateUniversity: function(data) {
    return this.updateData('Universities', data)
  },
  updateTerm: function(data) {
    return this.updateData('Terms', data)
  },
  updateDepartment: function(data) {
    return this.updateData('Departments', data)
  },
  updateCourse: function(data) {
    return this.updateData('Courses', data)
  },
  updateOffering: function(data) {
    return this.updateData('Offerings', data)
  },
  updatePlaylist: function(data) {
    return this.updateData('Playlists', data)
  },
  renameMedia: function(mediaId, name) {
    let params = { name, mediaId }
    return http.put('/api/Media/PutMediaName', null, api.withAuth({ params }))
  },
  updateMediaMetadata: function(mediaId, jsonMetadata) {
    return this.updateData('Media/PutJsonMetaData', jsonMetadata, mediaId)
  },
}