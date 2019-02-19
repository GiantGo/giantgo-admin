import request from '@/utils/request'

export function getRoleList (page, limit) {
  return request({
    url: '/roles',
    method: 'GET',
    params: {
      page, limit
    }
  })
}

export function getRole (roleId) {
  return request({
    url: '/roles/' + roleId,
    method: 'GET'
  })
}

export function createRole (roleInfo) {
  return request({
    url: '/roles',
    method: 'POST',
    data: roleInfo
  })
}

export function updateRole (roleInfo) {
  return request({
    url: '/roles/' + roleInfo.id,
    method: 'PATCH',
    data: roleInfo
  })
}

export function deleteRole (roleId) {
  return request({
    url: '/roles/' + roleId,
    method: 'DELETE'
  })
}
