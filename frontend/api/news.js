const BASE_URL = 'http://localhost:8080/api'

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
          resolve(res.data)
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

export function getPublishedNews(page = 1, size = 10) {
  return request(`/news?page=${page}&size=${size}`, 'GET')
}

export function getPublishedNewsList() {
  return request('/news/published/list', 'GET')
}

export function getNewsById(id) {
  return request(`/news/${id}`, 'GET')
}

export function fetchNewsContent(url) {
  return request('/news/fetch-content', 'POST', { url })
}
