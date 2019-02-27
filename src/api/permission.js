import request from '@/utils/request'

export function getPermissionTree () {
  return request({
    url: '/permissions/tree',
    method: 'GET',
    params: {}
  })
}

export function createPermission (permissionInfo) {
  return request({
    url: '/permissions',
    method: 'POST',
    data: permissionInfo
  })
}

export function updatePermission (permissionInfo) {
  return request({
    url: '/permissions/' + permissionInfo.id,
    method: 'PATCH',
    data: permissionInfo
  })
}

export function deletePermission (permissionId) {
  return request({
    url: '/permissions/' + permissionId,
    method: 'DELETE'
  })
}
