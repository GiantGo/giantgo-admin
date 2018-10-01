import request from '@/utils/request'

export function getModelList (condition) {
  return request({
    url: '/models',
    method: 'get',
    data: {condition: condition}
  })
}

export function getModel (modelId) {
  return request({
    url: '/models/' + modelId,
    method: 'get'
  })
}

export function createModel (modelInfo) {
  return request({
    url: '/models',
    method: 'post',
    data: modelInfo
  })
}

export function updateModel (modelInfo) {
  return request({
    url: '/models/' + modelInfo.modelId,
    method: 'put',
    data: modelInfo
  })
}

export function deleteModel (modelId) {
  return request({
    url: '/models/' + modelId,
    method: 'delete'
  })
}
