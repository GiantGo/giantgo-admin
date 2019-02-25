import request from '@/utils/request'

export function getPermissionList (page, limit) {
  return request({
    url: '/permissions',
    method: 'GET',
    params: {
      page, limit
    }
  })
}
