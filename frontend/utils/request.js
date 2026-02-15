const BASE_URL = 'http://localhost:8080/api'

function request(options) {
  return new Promise((resolve, reject) => {
    const token = uni.getStorageSync('token')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token || '',
        'Content-Type': 'application/json'
      },
      success: (res) => {
        if (res.data.code === 200) {
          resolve(res.data)
        } else {
          uni.showToast({
            title: res.data.message || '请求失败',
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络错误',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

export function get(url, data) {
  return request({
    url,
    method: 'GET',
    data
  })
}

export function post(url, data) {
  return request({
    url,
    method: 'POST',
    data
  })
}

export function put(url, data) {
  return request({
    url,
    method: 'PUT',
    data
  })
}

export function del(url, data) {
  return request({
    url,
    method: 'DELETE',
    data
  })
}