const BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api').replace(/\/$/, '')
const REQUEST_TIMEOUT = 15000

function getToken() {
  return uni.getStorageSync('token') || ''
}

function handleUnauthorized() {
  uni.removeStorageSync('token')
  uni.removeStorageSync('user')
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('userId')
}

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}${url.startsWith('/') ? url : `/${url}`}`,
      method,
      data,
      timeout: REQUEST_TIMEOUT,
      header: {
        'Content-Type': 'application/json',
        ...(getToken() ? { Authorization: `Bearer ${getToken()}` } : {})
      },
      success: (res) => {
        const body = res.data || {}
        if (res.statusCode === 401 || res.statusCode === 403) {
          handleUnauthorized()
          uni.navigateTo({ url: '/pages/login/login' })
        }
        if (res.statusCode >= 200 && res.statusCode < 300) {
          if (body.code === undefined || body.code === 200) {
            resolve(body)
          } else {
            reject({ code: body.code, message: body.message || '请求失败', response: res })
          }
        } else {
          reject({ code: res.statusCode, message: body.message || '请求失败', response: res })
        }
      },
      fail: (err) => {
        reject({ code: -1, message: err.errMsg || '网络连接失败', cause: err })
      }
    })
  })
}

const http = {
  get: function(url, data) {
    return request(url, 'GET', data)
  },
  post: function(url, data) {
    return request(url, 'POST', data)
  },
  put: function(url, data) {
    return request(url, 'PUT', data)
  },
  delete: function(url, data) {
    return request(url, 'DELETE', data)
  }
}

export default http

export function get(url, data) {
  return request(url, 'GET', data)
}

export function post(url, data) {
  return request(url, 'POST', data)
}

export function put(url, data) {
  return request(url, 'PUT', data)
}

export function del(url, data) {
  return request(url, 'DELETE', data)
}

// 获取完整的图片URL
export function getImageUrl(relativePath) {
  if (!relativePath) {
    return ''
  }
  if (relativePath.startsWith('http')) {
    return relativePath
  }
  return `${BASE_URL}${relativePath.startsWith('/') ? relativePath : `/${relativePath}`}`
}

export { getToken, handleUnauthorized }
