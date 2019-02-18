import request from '@/utils/request'

export function signIn (userName, password) {
  return request({
    url: '/user/token',
    method: 'post',
    data: {
      userName,
      password
    }
  })
}

export function signUp (userInfo) {
  return request({
    url: '/user',
    method: 'post',
    data: userInfo
  })
}

export function getMyInfo () {
  return request({
    url: '/user',
    method: 'get'
  })
}

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
