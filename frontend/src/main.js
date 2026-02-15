import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// 配置axios
const service = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = token
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      alert(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error)
    alert('网络错误')
    return Promise.reject(error)
  }
)

const app = createApp(App)
app.config.globalProperties.$axios = service
app.use(router)
app.mount('#app')

// 初始化推送通知服务
import pushNotificationService from './services/pushNotificationService'
pushNotificationService.initialize()