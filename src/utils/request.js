import axios from 'axios'
import { getToken } from '@/utils/token'
import store from '@/store'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_URL, // api的base_url
  timeout: 5000 // request timeout
})

service.interceptors.request.use(function (config) {
  if (getToken()) {
    config.headers['authorization'] = 'Bearer ' + getToken()
  }

  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

service.interceptors.response.use(function (response) {
  // Do something with response data
  return response
}, function (error) {
  // Do something with response error
  if (error.response.status === 401) {
    store.dispatch('logout').then(() => {
      window.location.reload()
    })
  } else if (error.response.status === 403) {
    router.push({path: '/401'})
  }

  return Promise.reject(error)
})

export default service
