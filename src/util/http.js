import axios from 'axios';
import authentication from 'react-azure-adb2c'

const http = axios.create({
  baseURL: 'https://classtranscribe.ncsa.illinois.edu:4443/api/',
  timeout: 10000,
});

// export function 

export const api = {
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
  getData: function (name) {
    return http.get(`${name}`)
  },
  postData: function (name, data) {
    return http.post(`${name}`, data);
  },
  updateData: function (name, data) {
    return http.put(`${name}/${data.id}`, data);
  },
  deleteData: function (name, id) {
    console.log(`${name}/${id}`)
    return http.delete(`${name}/${id}`)
  }
}