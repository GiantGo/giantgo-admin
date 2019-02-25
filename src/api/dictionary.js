import request from '@/utils/request'

export function getDictionaryTypeList () {
  return request({
    url: '/dictionaries/types',
    method: 'GET',
    params: {}
  })
}

export function getDictionaryType (dictionaryTypeId) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId,
    method: 'GET',
    params: {}
  })
}

export function createDictionaryType (dictionaryTypeInfo) {
  return request({
    url: '/dictionaries/types',
    method: 'POST',
    data: dictionaryTypeInfo
  })
}

export function updateDictionaryType (dictionaryTypeInfo) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeInfo.id,
    method: 'PATCH',
    data: dictionaryTypeInfo
  })
}

export function deleteDictionaryType (dictionaryTypeId) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId,
    method: 'DELETE'
  })
}

export function getDictionaryItemList (dictionaryTypeId) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId,
    method: 'GET',
    params: {}
  })
}

export function getDictionaryItem (dictionaryTypeId, dictionaryItemId) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId + '/items/' + dictionaryItemId,
    method: 'GET',
    params: {}
  })
}

export function createDictionaryItem (dictionaryTypeId, dictionaryItemInfo) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId + '/items',
    method: 'POST',
    data: dictionaryItemInfo
  })
}

export function updateDictionaryItem (dictionaryTypeId, dictionaryItemInfo) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId + '/items/' + dictionaryItemInfo.id,
    method: 'PATCH',
    data: dictionaryItemInfo
  })
}

export function deleteDictionaryItem (dictionaryTypeId, dictionaryItemId) {
  return request({
    url: '/dictionaries/types/' + dictionaryTypeId + '/items/' + dictionaryItemId,
    method: 'DELETE'
  })
}
