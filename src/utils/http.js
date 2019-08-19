import axios from 'axios'
const monthMap = require('./json/monthNames.json')

/**
 * Set up http
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 100000,
})


/**
 * api 
 * - Object for http requests from backend
 */
export const api = {
  initialData: require('./json/initialData.json'),
  offeringAccessType: require('./json/offeringAccessTypes.json'),
  playlistTypes: require('./json/playlistTypes.json'),

  /**
   * Function called when all the requests executed
   * then hide the loading page
   */
  baseUrl: () => process.env.REACT_APP_API_BASE_URL,
  contentLoaded: function (interval) {
    const ele = document.getElementById('ct-loading-wrapper')
    if(ele) {
      // fade out
      ele.classList.add('available')
      setTimeout(() => {
        // remove from DOM
        if (ele.parentNode) ele.outerHTML = ''
        // ele.classList.add('hide')
      }, interval || 500)
    }
  },

  /**
   * Functions for set or get the auth/b2c token
   */
  authToken: () => localStorage.getItem('authToken'),
  getAuthToken: function(auth0Token) {
    return http.post(this.baseUrl() + '/api/Account/SignIn', { auth0Token })
  },
  saveAuthToken: function (authToken) {
    localStorage.setItem('authToken', authToken)
  },
  withAuth: function (params) {
    return {
      params,
      headers: {
        Authorization: 'Bearer ' + this.authToken()
      }
    }
  },
  

  /********************* Functions for http requests *********************/

  /**
   * GET
   */
  getData: function (path, id, params) {
    path = `/api/${path}`
    if(id) path = `${path}/${id}`
    return http.get(path, this.withAuth(params))
  },
  /**
   * GET an array of pathes
   * callBack = (responce, stateName) => {this.setState({[stateName]: responce.data})}
   */ 
  getAll: function (value, callBack, handleError) {
    var array = []
    if (typeof value === 'string') { array.push(value) } 
    else { array = value }
    
    array.forEach( path => {
      const stateName = path.toLowerCase()
      this.getData(path)
        .then(responce => {
          if (callBack) callBack(responce, stateName)
        })
        .catch( error => {
          console.log(error) 
          if (handleError) handleError();
        })
    })
  },
  /**
   * Some specific get-by-id functions
   */
  // Universities
  getUniversityById: function (id) {
    return this.getData('Universities', id)
  },
  // Terms
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
  },
  // Departments
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
  getMediaFullPath: function(path) { // need to change later
    return `${this.baseUrl()}${path}`
  },
  getMediaById: function(mediaId) {
    return this.getData('Media', mediaId)
  },
  getCaptionsByTranscriptionId: function(transId) {
    return this.getData('Captions/ByTranscription', transId)
  },

  completeSingleOffering: function(courseOffering, setOffering, index, currOfferings) {
      // set id for future use
      courseOffering.id = courseOffering.offering.id
      // get department acronym
      courseOffering.courses.forEach( course => {
        this.getData('Departments', course.departmentId) 
          .then( ({data}) => {
            course.acronym = data.acronym
            if (index !== undefined) {
              currOfferings[index] = courseOffering
              setOffering(currOfferings)
            } else {
              setOffering(courseOffering)
            }
          })
      })
      // get term name
      this.getData('Terms', courseOffering.offering.termId)
        .then(({data}) => {
          courseOffering.offering.termName = data.name
          if (index !== undefined) {
            currOfferings[index] = courseOffering
            setOffering(currOfferings)
          } else {
            setOffering(courseOffering)
          }
        })
  },
  completeOfferings: function(rawOfferings, currOfferings, setOffering) {
    // rawOfferings = handleData.shuffle(rawOfferings)
    rawOfferings.forEach( (offering, index) => {
      this.getData('Offerings', offering.id)
        .then( ({data}) => {
          this.completeSingleOffering(data, setOffering, index, currOfferings)
        })
    })
  },
  getFullNumber: function(courses, separator) {
    var name = ''
    courses.forEach( course => {
      name += (course.acronym || '') + course.courseNumber + (separator || '/')
    })
    name = name.slice(0, name.length - 1)
    return name
  },
  parseMedia: function(media) {
    let re = { 
      id: '', 
      mediaName: '', 
      createdAt: '', 
      isTwoScreen: false, 
      videos: [], 
      transcriptions: [] 
    }
    if (!media) return re
    const { id, playlistId, jsonMetadata, sourceType, videos, transcriptions } = media
    if (!id || !jsonMetadata || !videos) return re
    re.id = id
    re.videos = videos
    re.createdAt = jsonMetadata.createdAt
    re.playlistId = playlistId
    re.isTwoScreen = videos.length > 0 && videos[0].video2 !== null
    if (sourceType === 1) { // youtube
      re.mediaName = jsonMetadata.title
    } else if (sourceType === 0) { // echo360
      let { lessonName, createdAt } = jsonMetadata
      let date = new Date(createdAt)
      re.mediaName = `${lessonName}  ${monthMap[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    }
    transcriptions.forEach( trans => {
      re.transcriptions.push({
        mediaId: trans.mediaId,
        id: trans.id,
        language: trans.language,
        src: this.getMediaFullPath(trans.file.path)
      })
    })
    return re
  },

  /**
   * POST
   * callBack = responce => {...}
   */
  postData: function (path, data, callBack, params) {
    path = `/api/${path}`
    if (callBack) 
      return http.post(path, data, this.withAuth(params))
        .then(responce => callBack(responce))
    else 
      return http.post(path, data, this.withAuth(params))
  },
  postToCourseOfferings: function (data) {
    return this.postData('CourseOfferings', data)
  },
  postOfferingAddInstructors: function (offeringId, data) {
    return this.postData(`Offerings/AddUsers/${offeringId}/Instructor`, data)
  },
  createCourse: function(data, callBack) {
    return this.postData('Courses', data, callBack)
  },
  createPlaylist: function(data, callBack) {
    return this.postData('Playlists', data, callBack)
  },
  uploadVideo: function (playlistId, video1, video2) {
    return this.postData('Media', null, null, {playlistId, video1, video2})
  },
  addNewRole: function (mailId) {
    return this.postData('Roles', null, null, {mailId})
  },
  /**
   * PUT
   * callBack = responce => {...}
   */
  updateData: function (path, data, callBack) {
    path = `/api/${path}`
    if (callBack) 
      return http.put(`${path}/${data.id}`, data, this.withAuth())
        .then(responce => callBack(responce))
    else 
      return http.put(`${path}/${data.id}`, data, this.withAuth())
  },
  updateCourse: function(data, callBack) {
    return this.updateData('Courses', data, callBack)
  },
  updatePlaylist: function(data, callBack) {
    return this.updateData('Playlists', data, callBack)
  },
  updateCaptionLine: function(data, callBack) {
    return this.updateData('Captions', data, callBack)
  },
  /**
   * DELETE
   * callBack = responce => {...}
   */
  deleteData: function (path, id, callBack, params) {
    path = `/api/${path}`
    if (callBack)
      return http.delete(`${path}/${id}`, this.withAuth(params))
        .then(responce => callBack(responce))
    else 
      return http.delete(`${path}/${id}`, this.withAuth(params))
  },
  deleteFromCourseOfferings: function (courseId, offeringId) {
    return http.delete(`CourseOfferings/${courseId}/${offeringId}`)
  },
  deleteUserFromOffering: function(offeringId, userId) {
    return this.deleteData(`UserOfferings/${offeringId}/${userId}`)
  },
  deleteCourse: function(courseId, callBack) {
    return this.deleteData('Courses', courseId, callBack)
  },
  deletePlaylist: function(playlistId, callBack) {
    return this.deleteData('Playlists', playlistId, callBack)
  },
  deleteInstructor: function(mailId) {
    return http.delete('/api/Roles', this.withAuth({ mailId }))
  },

}