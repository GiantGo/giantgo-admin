import request from '@/utils/request'

export function getMenuTree (module) {
  return request({
    url: '/menus/tree',
    method: 'GET',
    params: {
      module
    }
  })
}

export function createMenu (menuInfo) {
  return request({
    url: '/menus',
    method: 'POST',
    data: menuInfo
  })
}

export function updateMenu (menuInfo) {
  return request({
    url: '/menus/' + menuInfo.id,
    method: 'PATCH',
    data: menuInfo
  })
}

export function deleteMenu (menuId) {
  return request({
    url: '/menus/' + menuId,
    method: 'DELETE'
  })
}
