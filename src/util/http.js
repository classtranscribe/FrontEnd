import axios from 'axios';
import authentication from 'react-azure-adb2c'

const apiMap = {
  'term': 'Terms',
  'uni': 'Universities',
  'depart': 'Departments',
}

const initialData = {
  initialTermData: {name: '', startDate: ''},
  initialUniData: {name: '', domain: ''},
  initialDepartData: {name: '', acronym: '', universityId: ''},
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

  // http requests
  getData: function (name, id) {
    name = id ? `${name}/${id}` : name;
    return http.get(name);
  },
  postData: function (name, data) {
    return http.post(name, data);
  },
  updateData: function (name, data) {
    return http.put(`${name}/${data.id}`, data);
  },
  deleteData: function (name, id) {
    console.log(`${name}/${id}`)
    return http.delete(`${name}/${id}`)
  },

  getApiPath: function(str) {
    str = str.toLowerCase();
    console.log(str)
    for (var key in this.apiMap) {
      if (str.includes(key)) return this.apiMap[key];
    }
  }
}