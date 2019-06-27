import request from '@/utils/request'

export function getPostList (page, limit, keyword) {
  return request({
    url: '/posts',
    method: 'GET',
    params: {
      page,
      limit,
      keyword
    }
  })
}

export function getPost (postId) {
  return request({
    url: '/posts/' + postId,
    method: 'GET'
  })
}

export function createPost (postInfo) {
  return request({
    url: '/posts',
    method: 'POST',
    data: postInfo
  })
}

export function updatePost (postInfo) {
  return request({
    url: '/posts/' + postInfo.id,
    method: 'PATCH',
    data: postInfo
  })
}

export function deletePost (postId) {
  return request({
    url: '/posts/' + postId,
    method: 'DELETE'
  })
}
