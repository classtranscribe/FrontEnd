import axios from 'axios'
import authentication from 'react-azure-adb2c'

// Object for initializing data to post
export const initialData = {
  initialTerm: {
    name: '', 
    startDate: '', 
    endDate: '',
    universityId: ''
  },
  initialUni: {
    name: '', 
    domain: ''
  },
  initialDepart: {
    name: '', 
    acronym: '', 
    universityId: ''
  },
  initialCourse: {
    courseName: '', 
    courseNumber: '', 
    description: '', 
    departmentId: ''
  },
  initialOffering: {
    offering: {
      sectionName: '',
      termId: '',
      accessType: 'Public'
    },
    courseId: '',
    instructorId: '',
  },
  initialPlaylist: {
    description: '',
    offeringId: '',
    type: 'Uploaded'
  },
  initialVideo: {
    description: '',
    playlistId: '',
    path: '',
  },
}

// Select Options for offering's accessType
const offeringAccessTypes = [
  {name: 'Public', id: 'Public'},
  {name: 'Authenticated Only', id: 'AuthenticatedOnly'},
  {name: 'Students Only', id: 'StudentsOnly'},
  {name: 'University Only', id: 'UniversityOnly'}
]

const playlistTypes = [
  {name: 'Video Files', id: 'Uploaded'},
  {name: 'YouTube Playlist', id: 'YouTube'},
  {name: 'Echo360 Playlist', id: 'Echo360'},
]

/**
 * Set up http
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
})


/**
 * api 
 * - Object for http requests from backend
 */
export const api = {
  initialData: initialData,
  offeringAccessType: offeringAccessTypes,
  playlistTypes: playlistTypes,

  /**
   * Functions for set or get the auth/b2c token
   */
  b2cToken: () => authentication.getAccessToken(),
  authToken: () => localStorage.getItem('authToken'),
  getAuthToken: function() {
    return http.post('https://sysprog.ncsa.illinois.edu:4443/Account/SignIn', {"b2cToken": this.b2cToken()})
  },
  saveAuthToken: function (responce) {
    localStorage.setItem('authToken', responce.data.authToken)
  },

  /********************* Functions for http requests *********************/

  /**
   * GET
   */
  getData: function (path, id) {
    path = id ? `${path}/${id}` : path
    return http.get(path)
  },
  /**
   * GET an array of pathes
   * callBack = (responce, stateName) => {this.setState(stateName: responce.data)}
   */ 
  getAll: function (value, callBack, handleError) {
    var array = []
    if (typeof value === 'string') { array.push(value) } 
    else { array = value }
    
    for (var i = 0; i < array.length; i++) {
      const path = array[i]
      const stateName = path.toLowerCase()
      this.getData(path)
        .then(responce => {
          if (callBack) callBack(responce, stateName)
        })
        .catch( error => {
          console.log(error) 
          if (handleError) handleError();
        })
    }
  },
  /**
   * Some specific get-by-id functions
   */
  getDepartsByUniId: function (id) {
    return this.getData('Departments/ByUniversity', id)
  },
  getCoursesByDepartId: function (id) {
    return this.getData('Courses/ByDepartment', id) 
  },
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
  },
  getCoursesByInstId: function (id) {
    return this.getData('Courses/ByInstructor', id) 
  },
  getCourseOfferingsByInstructorId: function (id) {
    return this.getData('CourseOfferings/ByInstructor', id)
  },

  /**
   * POST
   * callBack = responce => {...}
   */
  postData: function (path, data, callBack) {
    if (callBack) 
      return http.post(path, data)
        .then(responce => callBack(responce))
    else 
      return http.post(path, data)
  },
  postToCourseOfferings: function (data) {
    return this.postData('CourseOfferings', data)
  },
  /**
   * PUT
   * callBack = responce => {...}
   */
  updateData: function (path, data, callBack) {
    return http.put(`${path}/${data.id}`, data)
      .then(responce => callBack(responce))
  },
  /**
   * DELETE
   * callBack = responce => {...}
   */
  deleteData: function (path, id, callBack) {
    return http.delete(`${path}/${id}`)
      .then(responce => callBack(responce))
  },

}