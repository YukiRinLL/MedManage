import request from '../utils/request.js'

function requestApi(url, method = 'GET', data = {}) {
  return request[method.toLowerCase()](url, data)
}

export function getPublishedNews(page = 0, size = 10) {
  return requestApi('/news/published', 'GET', { page, size })
}

export function getPublishedNewsList() {
  return requestApi('/news/published/list', 'GET')
}

export function getNewsById(id) {
  return requestApi(`/news/${id}/detail`, 'GET')
}

export function fetchNewsContent(url) {
  return requestApi('/news/fetch-content', 'POST', { url })
}
