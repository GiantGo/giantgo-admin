import request from '@/utils/request'

export function getUserList (page, limit) {
  return request({
    url: '/users',
    method: 'GET',
    params: {
      page,
      limit
    }
  })
}

export function createUser (userInfo) {
  return request({
    url: '/users',
    method: 'POST',
    data: userInfo
  })
}

export function updateUser (userInfo) {
  return request({
    url: '/users/' + userInfo.id,
    method: 'PATCH',
    data: userInfo
  })
}
