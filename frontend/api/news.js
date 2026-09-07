import { get, post } from '../utils/request.js'

export function getPublishedNews(page = 1, size = 10) {
  return get('/news', { page, size })
}

export function getPublishedNewsList() {
  return get('/news/published/list')
}

export function getNewsById(id) {
  return get(`/news/${id}`)
}

export function fetchNewsContent(url) {
  return post('/news/fetch-content', { url })
}
