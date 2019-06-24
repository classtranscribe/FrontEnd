import axios from 'axios';
// import authentication from 'react-azure-adb2c'

const apiMap = {
  'term': 'Terms',
  'uni': 'Universities',
  'depart': 'Departments',
}

const initialData = {
  initialTerm: {name: '', startDate: ''},
  initialUni: {name: '', domain: ''},
  initialDepart: {name: '', acronym: '', universityId: ''},
}

/**
 * Set up http
 */
const http = axios.create({
  baseURL: 'https://classtranscribe.ncsa.illinois.edu:4443/api/',
  timeout: 10000,
});


/**
 * Api 
 */
export const api = {
  apiMap: apiMap,
  initialData: initialData,

  // getToken: callBack => {
  //   if (localStorage.getItem('apiToken') === null) {
  //     const authToken = authentication.getAccessToken();
  //     http.post('Account/SignIn', {"b2cToken": authToken})
  //       .then(response => {
  //         // console.log(response.data)
  //         localStorage.setItem('apiToken', response.data);
  //         http.get('api/Values', {
  //           headers: {"Authorization": 'Bearer ' + response.data}
  //         }).then(response => callBack(response.data));
  //       });
  //     return;
  //   } else { 
  //     http.get('api/Values', {
  //       headers: {"Authorization": 'Bearer ' + localStorage.getItem('apiToken')}
  //     }).then(response => callBack(response.data)); 
  //   }
  // },

  getApiPath: function(str) {
    str = str.toLowerCase();
    console.log(str)
    for (var key in this.apiMap) {
      if (str.includes(key)) return this.apiMap[key];
    }
  },

  // http requests
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
      const path = array[i];
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
    console.log(`${path}/${id}`)
    http.delete(`${path}/${id}`)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },

}