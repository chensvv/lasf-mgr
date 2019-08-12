import axios from 'axios'
import router from '../router'
import {Loading} from 'element-ui'
// eslint-disable-next-line no-unused-vars
var service = {}
// axios 配置
// eslint-disable-next-line camelcase
const service_head = axios.create({
  baseURL: 'http://10.110.148.59:8085', // api的base_url
  timeout: 15000, // 请求超时时间
  withCredentials: true
})
let loading
function startLoading () { // 使用Element loading-start 方法
  // eslint-disable-next-line no-undef
  loading = Loading.service({
    lock: true,
    background: 'rgba(255,255,255,0.7)'
  })
}
function endLoading () { // 使用Element loading-close 方法
  loading.close()
}
// http request 拦截器
service_head.interceptors.request.use(
  config => {
    // console.log(config)
    startLoading()
    // if (localStorage.token) { // 判断token是否存在
    //   config.headers.Authorization = localStorage.token // 将token设置成请求头
    // }
    return config
  },
  err => {
    console.log(err)
    return Promise.reject(err)
  }
)

// http response 拦截器
service_head.interceptors.response.use(response => {
  // console.log(response)
  endLoading()
  if (response.status === 999) {
    router.replace('/login')
    console.log('token过期')
  }
  return response
},
error => {
  return Promise.reject(error)
}
)
export default service = {
  service_head
}
