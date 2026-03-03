import request from '@/utils/request'

export function getNewsList(page = 0, size = 10, keyword = '') {
  if (keyword) {
    return request({
      url: '/news/search',
      method: 'get',
      params: { keyword, page, size }
    })
  }
  return request({
    url: '/news',
    method: 'get',
    params: { page, size }
  })
}

export function getNewsById(id) {
  return request({
    url: `/news/${id}`,
    method: 'get'
  })
}

export function createNews(data) {
  return request({
    url: '/news',
    method: 'post',
    data
  })
}

export function updateNews(id, data) {
  return request({
    url: `/news/${id}`,
    method: 'put',
    data
  })
}

export function deleteNews(id) {
  return request({
    url: `/news/${id}`,
    method: 'delete'
  })
}

export function fetchTitle(url) {
  return request({
    url: '/news/fetch-title',
    method: 'post',
    data: { url }
  })
}

export function fetchContent(url) {
  return request({
    url: '/news/fetch-content',
    method: 'post',
    data: { url }
  })
}

export function fetchCover(url) {
  return request({
    url: '/news/fetch-cover',
    method: 'post',
    data: { url }
  })
}
