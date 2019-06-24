import axios from 'axios';
import authentication from 'react-azure-adb2c'

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

  getToken: callBack => {
    if (localStorage.getItem('apiToken') === null) {
      const authToken = authentication.getAccessToken();
      http.post('Account/SignIn', {"b2cToken": authToken})
        .then(response => {
          // console.log(response.data)
          localStorage.setItem('apiToken', response.data);
          http.get('api/Values', {
            headers: {"Authorization": 'Bearer ' + response.data}
          }).then(response => callBack(response.data));
        });
      return;
    } else { 
      http.get('api/Values', {
        headers: {"Authorization": 'Bearer ' + localStorage.getItem('apiToken')}
      }).then(response => callBack(response.data)); 
    }
  },

  getApiPath: function(str) {
    str = str.toLowerCase();
    console.log(str)
    for (var key in this.apiMap) {
      if (str.includes(key)) return this.apiMap[key];
    }
  },

  // http requests
  getData: function (name, id) {
    name = id ? `${name}/${id}` : name;
    return http.get(name);
  },
  // callBack = (responce, name) => {this.setState([name]: responce.data)}
  getAll: function (value, callBack, id) {
    var array = [];
    if (typeof value === 'string') { array.push(id ? `${value}/${id}` : value) } 
    else { array = value }
    
    for (var i = 0; i < array.length; i++) {
      const name = array[i];
      const stateName = name.toLowerCase();
      api.getData(name)
        .then(responce => callBack(responce, stateName))
        .catch( error => console.log(error))
    }
  },
  // callBack = responce => {...}
  postData: function (name, data, callBack) {
    http.post(name, data)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },
  // callBack = responce => {...}
  updateData: function (name, data, callBack) {
    http.put(`${name}/${data.id}`, data)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },
  // callBack = responce => {...}
  deleteData: function (name, id, callBack) {
    console.log(`${name}/${id}`)
    http.delete(`${name}/${id}`)
      .then(responce => callBack(responce))
      .catch( error => console.log(error))
  },

}