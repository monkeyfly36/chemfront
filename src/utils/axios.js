import axios from 'axios';

// axios.defaults.headers.common['Accept-Language'] = localStorage.getItem('language') ? localStorage.getItem('language') : getCurrentLocale();


axios.interceptors.request.use(config => {
    // if (config.url !== refreshTokenAPI && cookie.get('token')) {
    //   // config.headers['X-Authorization'] = window.tokenTestRun || newToken || cookie.get('token');
    //   config.headers['Authorization'] = cookie.get('token');
    // }
    config.headers['Authorization'] = 'Bearer EMPTY'
    return config;
  }, (error) => (
    Promise.reject(error)
))
  
export default axios