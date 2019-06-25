import axios from 'axios';
import authentication from 'react-azure-adb2c'

const apiMap = {
  'term': 'Terms',
  'uni': 'Universities',
  'depart': 'Departments',
  'course': 'Courses',
}

const initialData = {
  initialTerm: {name: '', startDate: ''},
  initialUni: {name: '', domain: ''},
  initialDepart: {name: '', acronym: '', universityId: ''},
  initialCourse: {courseName: '', courseNumber: '', description: '', departmentId: ''},
}

/**
 * Set up http
 */
const http = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
});


/**
 * Api 
 */
export const api = {
  apiMap: apiMap,
  initialData: initialData,
  authToken: authentication.getAccessToken(),
  apiToken: localStorage.getItem('apiToken'),

  /**
   * Get token
   */
  getApiToken: function() {
    return http.post('Account/SignIn', {"b2cToken": this.authToken})
  },
  apiToken: function () {
    return this.apiToken;
  },
  saveApiToken: function (data) {
    localStorage.setItem('apiToken', data);
  },


  /**
   * http requests
   */
  getApiPath: function(str) {
    str = str.toLowerCase();
    for (var key in this.apiMap) {
      if (str.includes(key)) return this.apiMap[key];
    }
  },
  getData: function (path, id) {
    path = id ? `${path}/${id}` : path;
    return http.get(path);
  },
  // callBack = (responce, path) => {this.setState([path]: responce.data)}
  getAll: function (value, callBack, id) {
    var array = [];
    if (typeof value === 'string') { array.push(id ? `${value}/${id}` : value) } 
    else { array = value }
    
    for (var i = 0; i < array.length; i++) {
      const path = array[i]
      const stateName = path.toLowerCase();
      this.getData(path)
        .then(responce => callBack(responce, stateName))
        .catch( error => console.log(error))
    }
  },
  // callBack = responce => {...}
  postData: function (path, data, callBack) {
    http.post(path, data)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },
  // callBack = responce => {...}
  updateData: function (path, data, callBack) {
    http.put(`${path}/${data.id}`, data)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },
  // callBack = responce => {...}
  deleteData: function (path, id, callBack) {
    http.delete(`${path}/${id}`)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },

  getDepartsByUniId: function (id) {
    return this.getData('Departments/ByUniversity', id)
  },
  getCoursesByDepartId: function (id) {
    return this.getData('Courses/ByDepartment', id) 
  },
  getTermsByUniId: function (id) {
    return this.getData('Terms/ByUniversity', id) 
    // return this.getData('Terms') 
  },
  getCoursesByInstId: function (id) {
    return this.getData('Courses/ByInstructor', id) 
  },


}