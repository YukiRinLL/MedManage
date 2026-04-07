const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

function request(url, method = 'GET', data = {}) {
  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Authorization': uni.getStorageSync('token') || ''
      },
      success: (res) => {
        if (res.statusCode === 200) {
          if (res.data.code === 200) {
            resolve(res.data)
          } else {
            reject({
              code: res.data.code,
              message: res.data.message || '请求失败'
            })
          }
        } else {
          reject({
            code: res.statusCode,
            message: res.data.message || '请求失败'
          })
        }
      },
      fail: (err) => {
        reject({
          code: -1,
          message: '网络连接失败'
        })
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
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
  return `${BASE_URL}${relativePath}`
}
