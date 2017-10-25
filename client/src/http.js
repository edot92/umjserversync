import Vue from 'vue';
import axios from 'axios';
import config from './config';
// import VueAxios from 'vue-axios';

// enable mock
import mock from './mock';
if (!config.debug.mock) {
  mock.restore();
}
// Vue.use(VueAxios, axios);
var http = axios.create({
  baseURL: config.api,
  timeout: 5000,
  headers: {
    // 'Access-Control-Allow-Origin': '*'
    // Authorization: 'Bearer ' + localStorage.getItem('token')
  }
  // withCredentials: true
  // headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
});
http.interceptors.request.use(
  function (request) {
    return request;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);
http.interceptors.response.use(
  function (response) {
    const request = response.config;
    if (config.debug.http) {
      console.log(
        '>>>',
        request.method.toUpperCase(),
        request.url,
        request.params,
        '\n   ',
        response.status,
        response.data
      );
    }
    return response;
  },
  function (error) {
    if (config.debug.http) {
      let { response, config: request } = error;
      if (request) {
        console.log(
          '>>>',
          request.method.toUpperCase(),
          request.url,
          request.params,
          '\n   ',
          response.status,
          response.data
        );
      }
    }
    // Do something with response error
    return Promise.reject(error);
  }
);

Vue.prototype.$http = http;
