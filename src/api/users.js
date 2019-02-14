import request from '@/utils/request'

export function getUserList (page, limit) {
  return request({
    url: '/users',
    method: 'get',
    data: {
      page,
      limit
    }
  })
}
