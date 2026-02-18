import axios from 'axios'
import { ElMessage } from 'element-plus'
import { useUserStore } from '@/store/user'

const request = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

request.interceptors.request.use(
  config => {
    console.log('请求配置:', {
      url: config.url,
      method: config.method,
      baseURL: config.baseURL,
      fullURL: `${config.baseURL}${config.url}`,
      data: config.data,
      headers: config.headers
    })
    const userStore = useUserStore()
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`
    }
    return config
  },
  error => {
    console.error('请求拦截器错误:', error)
    return Promise.reject(error)
  }
)

request.interceptors.response.use(
  response => {
    console.log('响应数据:', {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      data: response.data,
      dataType: typeof response.data,
      dataString: JSON.stringify(response.data, null, 2)
    })
    const res = response.data
    if (res.code !== 200) {
      console.error('响应码不是200:', res.code, res.message)
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    console.log('响应成功，返回数据:', res)
    return res
  },
  error => {
    console.error('响应错误:', error)
    console.error('错误响应:', error.response)
    console.error('错误响应数据:', error.response?.data)
    console.error('错误响应数据字符串:', JSON.stringify(error.response?.data, null, 2))
    if (error.response?.status === 401) {
      console.log('401错误，跳转到登录页')
      const userStore = useUserStore()
      userStore.logout()
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    } else {
      ElMessage.error(error.message || '网络错误')
    }
    return Promise.reject(error)
  }
)

export default request
