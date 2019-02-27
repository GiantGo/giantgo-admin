import request from '@/utils/request'

export function signIn (userName, password) {
  return request({
    url: '/user/token',
    method: 'POST',
    data: {
      userName,
      password
    }
  })
}

export function signUp (userInfo) {
  return request({
    url: '/user',
    method: 'POST',
    data: userInfo
  })
}

export function getMyInfo () {
  return request({
    url: '/user',
    method: 'GET'
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

export function assignRoles (userId, roles) {
  return request({
    url: '/users/' + userId + '/roles',
    method: 'PUT',
    data: roles
  })
}

export function getMyMenu () {
  return request({
    url: '/user/menu',
    method: 'get',
    data: {}
  })
}
