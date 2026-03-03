import http from '../utils/request'

function request(url, method = 'GET', data = {}) {
  return http[method.toLowerCase()](url, data)
}

export function getPublishedNews(page = 0, size = 10) {
  return request('/news/published', 'GET', { page, size })
}

export function getPublishedNewsList() {
  return request('/news/published/list', 'GET')
}

export function getNewsById(id) {
  return request(`/news/${id}/detail`, 'GET')
}

export function fetchNewsContent(url) {
  return request('/news/fetch-content', 'POST', { url })
}
