import request from '@/utils/request'

export function getMenuList (module) {
  return request({
    url: '/menus',
    method: 'GET',
    params: {
      module
    }
  })
}
